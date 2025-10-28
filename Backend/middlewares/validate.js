export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

export const validateSignup = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),

  body("role")
    .optional()
    .isIn(["student", "senior", "alumni", "admin"])
    .withMessage("Invalid role"),
  handleValidationErrors,
];

export const validateLogin = [
  body("email").trim().notEmpty().withMessage("Valid email is required"),
  body("password").notEmpty()
    .withMessage("Password is required"),
  handleValidationErrors,
];

export const validateHackathon = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Valid start date required'),
  
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Valid end date required')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  
  body('type')
    .isIn(['In-Person', 'Online', 'Hybrid']).withMessage('Invalid type'),
  
  handleValidationErrors
];

export const validateResource = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Notes', 'Books', 'Projects', 'Tutorials', 'Interview Prep', 'Research Papers', 'Other'])
    .withMessage('Invalid category'),
  
  handleValidationErrors
];

export const validateTeamRequest = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  
  body('event')
    .trim()
    .notEmpty().withMessage('Event name is required'),
  
  body('eventType')
    .isIn(['hackathon', 'project', 'competition', 'other']).withMessage('Invalid event type'),
  
  body('skillsNeeded')
    .isArray({ min: 1 }).withMessage('At least one skill is required'),
  
  body('spotsAvailable')
    .isInt({ min: 1, max: 10 }).withMessage('Spots must be between 1-10'),
  
  handleValidationErrors
];

export const validateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Location must not exceed 100 characters'),
  
  body('skills')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch {
          throw new Error('Skills must be valid JSON array');
        }
      }
      return true;
    }),
  
  handleValidationErrors
];