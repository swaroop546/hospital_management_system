'use strict';

const repo = require('../../repositories/departmentRepository');
const { success, created, notFound } = require('../../utils/response');
const { syncDepartment } = require('../../services/graphService');

const listDepartments = async (req, res, next) => {
  try { return success(res, await repo.findAll({ isActive: true })); } catch (err) { next(err); }
};
const createDepartment = async (req, res, next) => {
  try {
    const department = await repo.create({ name: req.body.name, description: req.body.description });
    const graphSynchronized = await syncDepartment(department);
    return created(res, { ...department, graphSynchronized }, 'Department created');
  } catch (err) { next(err); }
};
const updateDepartment = async (req, res, next) => {
  try {
    const department = await repo.update(req.params.id, req.body);
    if (!department) return notFound(res, 'Department not found');
    return success(res, department, 'Department updated');
  } catch (err) { next(err); }
};

module.exports = { listDepartments, createDepartment, updateDepartment };
