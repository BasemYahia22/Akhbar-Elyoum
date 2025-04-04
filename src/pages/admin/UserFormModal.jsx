import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  userData,
  setUserData,
  role,
}) => {
  // State for form errors, layout, and password visibility
  const [errors, setErrors] = useState({});
  const [isTallLayout, setIsTallLayout] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Check window height for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsTallLayout(window.innerHeight > 700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    // Clear error if field is corrected
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};

    // Common validations for all roles
    if (!userData.FirstName?.trim())
      newErrors.FirstName = "First name is required";
    if (!userData.LastName?.trim())
      newErrors.LastName = "Last name is required";
    if (!userData.Email?.trim()) newErrors.Email = "Email is required";
    if (!userData.gender) newErrors.gender = "Gender is required";
    if (!isEditing && !userData.PasswordHash?.trim())
      newErrors.PasswordHash = "Password is required";

    // Student-specific validations
    if (role === "Student") {
      if (!userData.std_code?.trim())
        newErrors.std_code = "Student code is required";
      if (!userData.Major?.trim()) newErrors.Major = "Major is required";
      if (!userData.AcademicLevel?.trim())
        newErrors.AcademicLevel = "Academic level is required";
      if (!userData.department?.trim())
        newErrors.department = "Department is required";
      if (!userData.squad_number)
        newErrors.squad_number = "Squad number is required";
      if (!userData.semester_number)
        newErrors.semester_number = "Semester number is required";
    }
    // Professor-specific validations
    else if (role === "Professor") {
      if (!userData.Department?.trim())
        newErrors.Department = "Department is required";
      if (!userData.course_id) newErrors.course_id = "Course ID is required";
    }
    // Admin-specific validations
    else if (role === "Admin") {
      if (!userData.Role?.trim()) newErrors.Role = "Admin role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Prepare form data for submission
    const formData = {
      FirstName: userData.FirstName.trim(),
      LastName: userData.LastName.trim(),
      Email: userData.Email.trim(),
      gender: userData.gender,
      status: userData.status || 1,
      UserType: role,
      std_code: userData.std_code?.trim() || "",
    };

    // Include password if new user or password was changed
    if (!isEditing || userData.PasswordHash?.trim()) {
      formData.PasswordHash = userData.PasswordHash.trim();
    }

    // Add role-specific fields
    if (role === "Student") {
      formData.major = userData.Major.trim();
      formData.academic_level = userData.AcademicLevel.trim();
      formData.department = userData.department.trim();
      formData.squad_number = parseInt(userData.squad_number);
      formData.semester_number = parseInt(userData.semester_number);

      // Include additional student fields when editing
      if (isEditing && userData.student_id) {
        formData.user_id = userData.student_id;
        formData.gpa = userData.gpa || 0;
        formData.passed_hours = userData.passed_hours || 0;
        formData.registered_hours = userData.registered_hours || 0;
        formData.available_hours = userData.available_hours || 0;
      }
    } else if (role === "Professor") {
      formData.Department = userData.Department.trim();
      formData.course_id = parseInt(userData.course_id);
      if (isEditing && userData.professor_id) {
        formData.user_id = userData.professor_id;
      }
    } else if (role === "Admin") {
      formData.Role = userData.Role.trim();
      if (isEditing && userData.admin_id) {
        formData.user_id = userData.admin_id;
      }
    }

    onSubmit(isEditing ? "edit" : "add", formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`w-full ${
          isTallLayout ? "max-w-2xl" : "max-w-4xl"
        } p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto`}
      >
        {/* Modal header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit" : "Add"} {role}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit}>
          <div
            className={`grid ${
              isTallLayout ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2"
            } gap-4 mb-4`}
          >
            {/* Common fields for all roles */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                First Name *
              </label>
              <input
                type="text"
                name="FirstName"
                value={userData.FirstName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.FirstName && (
                <p className="mt-1 text-sm text-red-500">{errors.FirstName}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Last Name *
              </label>
              <input
                type="text"
                name="LastName"
                value={userData.LastName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.LastName && (
                <p className="mt-1 text-sm text-red-500">{errors.LastName}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                {role === "Student" ? "Student Code" : "User Code"} *
              </label>
              <input
                type="text"
                name="std_code"
                value={userData.std_code || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.std_code && (
                <p className="mt-1 text-sm text-red-500">{errors.std_code}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email *</label>
              <input
                type="email"
                name="Email"
                value={userData.Email || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.Email && (
                <p className="mt-1 text-sm text-red-500">{errors.Email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Gender *</label>
              <select
                name="gender"
                value={userData.gender || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
              )}
            </div>

            {/* Password field with visibility toggle */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Password {!isEditing && "*"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="PasswordHash"
                  value={userData.PasswordHash || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required={!isEditing}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.PasswordHash && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.PasswordHash}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Status *</label>
              <select
                name="status"
                value={userData.status ?? 1}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            {/* Student-specific fields */}
            {role === "Student" && (
              <>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Major *
                  </label>
                  <input
                    type="text"
                    name="Major"
                    value={userData.Major || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  {errors.Major && (
                    <p className="mt-1 text-sm text-red-500">{errors.Major}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Academic Level *
                  </label>
                  <input
                    type="text"
                    name="AcademicLevel"
                    value={userData.AcademicLevel || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  {errors.AcademicLevel && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.AcademicLevel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={userData.department || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Squad Number *
                  </label>
                  <input
                    type="number"
                    name="squad_number"
                    value={userData.squad_number || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                  {errors.squad_number && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.squad_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Semester Number *
                  </label>
                  <input
                    type="number"
                    name="semester_number"
                    value={userData.semester_number || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                  {errors.semester_number && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.semester_number}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Professor-specific fields */}
            {role === "Professor" && (
              <>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="Department"
                    value={userData.Department || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  {errors.Department && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.Department}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Course ID *
                  </label>
                  <input
                    type="number"
                    name="course_id"
                    value={userData.course_id || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                  {errors.course_id && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.course_id}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Admin-specific fields */}
            {role === "Admin" && (
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Admin Role *
                </label>
                <select
                  name="Role"
                  value={userData.Role || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="" disabled>
                    Select Admin Role
                  </option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Department Admin">Department Admin</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Support Admin">Support Admin</option>
                </select>
                {errors.Role && (
                  <p className="mt-1 text-sm text-red-500">{errors.Role}</p>
                )}
              </div>
            )}
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded bg-third"
            >
              {isEditing ? "Update" : "Create"} {role}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
