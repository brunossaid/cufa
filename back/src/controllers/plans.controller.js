import mongoose from "mongoose";
import Plan from "../models/plan.model.js";

// obtener todos los planes
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id })
      .populate("user")
      .populate("cells.itemId"); // tanto courses como extraTasks

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
    const { id } = req.params;
    const { cells, name } = req.body;

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }

    if (name !== undefined) {
      plan.name = name;
    }

    if (cells && Array.isArray(cells)) {
      plan.cells = cells;
    }

    console.log("(UP)plan.cells: ", req.body);

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// eliminar un item del plan (course o extraTask)
export const removeItemFromPlan = async (req, res) => {
  const { id } = req.params;
  const { itemId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { $pull: { cells: { itemId: new mongoose.Types.ObjectId(itemId) } } },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Item removed from plan", updatedPlan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtener plan por ID
export const getPlan = async (req, res) => {
  try {
    const planData = await Plan.findById(req.params.id)
      .populate("user")
      .populate("cells.itemId");

    if (!planData) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.json(planData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
