import ExtraTask from "../models/extraTask.model.js";

// obtener todas las actividades extra
export const getExtraTasks = async (req, res) => {
  try {
    const extraTasks = await ExtraTask.find({ user: req.user.id })
      .populate("user")
      .sort({ createdAt: 1 }); // ordena por fecha de creación
    res.json(extraTasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// crear actividad extra
export const createExtraTask = async (req, res) => {
  try {
    const { name, color } = req.body;

    const existingExtraTask = await ExtraTask.findOne({
      user: req.user.id,
      name, // reemplazamos "code" por "name"
    });

    if (existingExtraTask) {
      return res
        .status(400)
        .json({ message: "An activity with this name already exists." });
    }

    const newExtraTask = new ExtraTask({
      name,
      color,
      user: req.user.id,
    });

    await newExtraTask.save();
    res.status(201).json(newExtraTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// eliminar actividad extra
export const deleteExtraTask = async (req, res) => {
  try {
    const deletedExtraTask = await ExtraTask.findByIdAndDelete(req.params.id);
    if (!deletedExtraTask) {
      return res.status(404).json({ message: "Activity not found" });
    }
    return res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// editar actividad extra
export const updateExtraTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedExtraTask = await ExtraTask.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedExtraTask) {
      return res.status(404).json({ message: "Activity not found" });
    }

    return res.json(updatedExtraTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// obtener actividad extra por ID
export const getExtraTask = async (req, res) => {
  try {
    const extraTaskData = await ExtraTask.findById(req.params.id).populate(
      "user"
    );
    if (!extraTaskData) {
      return res.status(404).json({ message: "Activity not found" });
    }
    return res.json(extraTaskData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
