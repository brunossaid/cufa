export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    // procesa los errores de validación
    const errors = {};
    err.errors.forEach((e) => {
      errors[e.path[0]] = e.message;
    });
    return res.status(400).json({ errors });
  }
};
