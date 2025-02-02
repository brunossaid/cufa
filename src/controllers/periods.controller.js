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
    const { year, semester, user, courses } = req.body;

    const newPeriod = new Period({
      year,
      semester,
      user: req.user.id,
      courses,
    });

    await newPeriod.save();
    res.status(201).json(newPeriod);
  } catch (error) {
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
