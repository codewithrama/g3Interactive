import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { userService } from '../services/userService'
import { showToast } from '../utils/toast'
import './UserForm.css'

const ROLES = ['Admin', 'Manager', 'User']
const DESIGNATIONS = ['Designer', 'Project Manager', 'Production Manager', 'Sales Rep']

export default function UserForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    title: '',
    website: '',
    designation: '',
    image: null,
    imagePreview: null,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (isEdit) {
      loadUser()
    } else {
      setInitialLoad(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadUser = async () => {
    try {
      const user = await userService.getUserById(id)
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        title: user.title || '',
        website: user.website || '',
        designation: user.designation || '',
        image: null,
        imagePreview: user.image || null,
      })
    } catch {
      showToast('Failed to load user', 'error')
      navigate('/users')
    } finally {
      setInitialLoad(false)
    }
  }

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Name is required' : ''
      case 'email': {
        if (!value.trim()) return 'Email is required'
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(value.trim())) {
          return 'Please enter a valid email address'
        }
        return ''
      }
      case 'phone': {
        if (!value.trim()) return ''
        if (!/^\d+$/.test(value)) {
          return 'Phone number must contain only digits'
        }
        if (value.length < 10 || value.length > 15) {
          return 'Phone number must be between 10 and 15 digits'
        }
        return ''
      }
      case 'role':
        return !value ? 'Role is required' : ''
      case 'designation':
        return !value ? 'Designation is required' : ''
      default:
        return ''
    }
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      if (key === 'image' || key === 'imagePreview') return
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }))
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setFormData((prev) => ({ ...prev, phone: value }))
    if (touched.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: validateField('phone', value),
      }))
    }
  }

  const handleDesignationChange = (designation) => {
    setFormData((prev) => ({ ...prev, designation }))
    if (touched.designation) {
      setErrors((prev) => ({
        ...prev,
        designation: validateField('designation', designation),
      }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = {}
    Object.keys(formData).forEach((key) => {
      if (key !== 'image' && key !== 'imagePreview') {
        allTouched[key] = true
      }
    })
    setTouched(allTouched)

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error')
      return
    }

    setLoading(true)
    try {
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        role: formData.role,
        title: formData.title.trim(),
        website: formData.website.trim(),
        designation: formData.designation,
        image: formData.imagePreview,
      }

      if (isEdit) {
        await userService.updateUser(id, submitData)
        showToast('User updated successfully', 'success')
      } else {
        await userService.createUser(submitData)
        showToast('User created successfully', 'success')
      }

      setTimeout(() => {
        navigate('/users')
      }, 500)
    } catch {
      showToast('Failed to save user', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoad) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="user-form-container">
      <div className="user-form-header">
        <h1>{isEdit ? 'Edit User' : 'Add New User'}</h1>
        <button className="back-button" onClick={() => navigate('/users')}>
          ← Back to Users
        </button>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="image-upload-section">
            <div className="image-preview-container">
              {formData.imagePreview ? (
                <>
                  <img
                    src={formData.imagePreview}
                    alt="Profile preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={handleRemoveImage}
                    aria-label="Remove image"
                  >
                    🗑️
                  </button>
                </>
              ) : (
                <div className="image-placeholder">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
            >
              📤 Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={handleBlur}
                className={errors.phone ? 'error' : ''}
                placeholder="Enter your phone number"
                maxLength={15}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role">
                Role <span className="required">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.role ? 'error' : ''}
              >
                <option value="">Select user role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter your website"
              />
            </div>

            <div className="form-group">
              <label>
                Designation <span className="required">*</span>
              </label>
              <div className="designation-radio-group">
                {DESIGNATIONS.map((des) => (
                  <label key={des} className="radio-label">
                    <input
                      type="radio"
                      name="designation"
                      value={des}
                      checked={formData.designation === des}
                      onChange={() => handleDesignationChange(des)}
                      onBlur={() => setTouched((prev) => ({ ...prev, designation: true }))}
                    />
                    <span>{des}</span>
                  </label>
                ))}
              </div>
              {errors.designation && (
                <span className="error-message">{errors.designation}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/users')}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'EDIT' : 'ADD NEW USER'}
          </button>
        </div>
      </form>
    </div>
  )
}
