import course from "../models/course.model.js";

// obtener todas las materias
export const getCourses = async (req, res) => {
  try {
    const courses = await course.find({ user: req.user.id }).populate("user");
    res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// crear materia
export const createCourse = async (req, res) => {
  try {
    const {
      name,
      commission,
      professors,
      workload,
      schedules,
      classroom,
      building,
      grade,
      status,
      code,
      year,
      semester,
      prerequisites,
      type,
      periods,
      modality,
      observations,
    } = req.body;

    const newCourse = new course({
      name,
      commission,
      professors,
      workload,
      schedules,
      classroom,
      building,
      grade,
      status,
      code,
      year,
      semester,
      prerequisites,
      type,
      periods,
      modality,
      observations,
      user: req.user.id,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// eliminar materia
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.json({ message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// editar materia
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCourse = await course.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// obtener materia por ID
export const getCourse = async (req, res) => {
  try {
    const courseData = await course.findById(req.params.id).populate("user");
    if (!courseData) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.json(courseData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
