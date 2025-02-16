import Period from "../models/period.model.js";

// obtener todos los períodos
export const getPeriods = async (req, res) => {
  try {
    const periods = await Period.find({ user: req.user.id })
      .populate("user")
      .sort({ year: 1, semester: 1 }); // ordena por year y semester
    res.json(periods);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// crear período
export const createPeriod = async (req, res) => {
  try {
    const { year, semester, courses } = req.body;

    const existingPeriod = await Period.findOne({
      user: req.user.id,
      year,
      semester,
    });

    if (existingPeriod) {
      return res
        .status(400)
        .json({ message: "A period for this semester already exists." });
    }

    const newPeriod = new Period({
      year,
      semester,
      user: req.user.id,
      courses,
    });

    await newPeriod.save();
    res.status(201).json(newPeriod);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "A period for this semester already exists." });
    }
    return res.status(500).json({ message: error.message });
  }
};

// eliminar período
export const deletePeriod = async (req, res) => {
  try {
    const deletedPeriod = await Period.findByIdAndDelete(req.params.id);
    if (!deletedPeriod) {
      return res.status(404).json({ message: "Period not found" });
    }
    return res.json({ message: "Period deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// editar período
export const updatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPeriod = await Period.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPeriod) {
      return res.status(404).json({ message: "Period not found" });
    }

    return res.json(updatedPeriod);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// obtener período por ID
export const getPeriod = async (req, res) => {
  try {
    const periodData = await Period.findById(req.params.id).populate("user");
    if (!periodData) {
      return res.status(404).json({ message: "Period not found" });
    }
    return res.json(periodData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// eliminar course del period
export const deleteCourseFromPeriod = async (req, res) => {
  try {
    const { periodId, courseId } = req.params;

    const updatedPeriod = await Period.findByIdAndUpdate(
      periodId,
      { $pull: { courses: { courseId } } },
      { new: true }
    );

    if (!updatedPeriod) {
      return res.status(404).json({ message: "Period not found" });
    }

    return res.json(updatedPeriod);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// agregar course al period
export const addCourseToPeriod = async (req, res) => {
  try {
    const { periodId } = req.params;
    const { courseId, status, grade } = req.body;

    const period = await Period.findById(periodId);
    if (!period) {
      return res.status(404).json({ message: "Cursada no encontrado" });
    }

    // verificar si ya hay 5 cursos en el period
    if (period.courses.length >= 5) {
      return res
        .status(400)
        .json({ message: "La cursada ya tiene 5 materias" });
    }

    // verifica si el course ya existe en el period
    const courseExists = period.courses.some(
      (course) => course.courseId.toString() === courseId
    );
    if (courseExists) {
      return res
        .status(400)
        .json({ message: "Esa materia ya esta en este cuatrimestre" });
    }

    const newCourse = {
      courseId,
      status,
      grade: grade || null,
    };

    period.courses.push(newCourse);

    await period.save();
    return res.json(period);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
