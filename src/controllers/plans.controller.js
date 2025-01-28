import Plan from "../models/plan.model.js";

// obtener todos los planes
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id }).populate("user");
    res.json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// crear plan
export const createPlan = async (req, res) => {
  try {
    const { name, cells } = req.body;

    const newPlan = new Plan({
      name,
      cells,
      user: req.user.id,
    });

    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// eliminar plan
export const deletePlan = async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// editar plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params; // id del plan a actualizar
    const { cells, name } = req.body; // datos enviados desde el frontend

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }

    // actualizar el nombre del plan si se proporciona
    if (name !== undefined) {
      plan.name = name;
    }

    // reemplazar completamente las celdas
    if (cells && Array.isArray(cells)) {
      plan.cells = cells;
    }

    console.log("(UP)plan.cells: ", req.body);

    // guardar los cambios en la base de datos
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// editar plan (eliminar una materia completa)
export const removeCourseFromPlan = async (req, res) => {
  const { id } = req.params;
  const { courseCode } = req.body;

  try {
    // eliminar las celdas asociadas a courseCode
    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { $pull: { cells: { courseCode } } }, // `$pull` elimina elementos que coinciden con el filtro
      { new: true } // retorna el documento actualizado
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Course removed from plan", updatedPlan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtener plan por ID
export const getPlan = async (req, res) => {
  try {
    const planData = await Plan.findById(req.params.id).populate("user");
    if (!planData) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.json(planData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
