import optionalSlot from "../models/optionalSlot.model.js";

// obtener todos
export const getOptionalSlots = async (req, res) => {
  try {
    const slots = await optionalSlot
      .find({ user: req.user.id })
      .populate("user");
    res.json(slots);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// crear
export const createOptionalSlot = async (req, res) => {
  try {
    const { year, semester } = req.body;

    const newSlot = new optionalSlot({
      year,
      semester,
      user: req.user.id,
    });

    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// eliminar
export const deleteOptionalSlot = async (req, res) => {
  try {
    const deletedSlot = await optionalSlot.findByIdAndDelete(req.params.id);
    if (!deletedSlot) {
      return res.status(404).json({ message: "Optional slot not found" });
    }
    return res.json({ message: "Optional slot deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
