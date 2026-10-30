'use strict';

const userRepo = require('../../repositories/userRepository');
const { paginate, omit, now } = require('../../utils/helpers');
const { success, created, notFound, conflict, forbidden } = require('../../utils/response');
const { ROLES } = require('../../utils/roles');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { syncDoctor } = require('../../services/graphService');

const SAFE_FIELDS = ['passwordHash'];
const sanitize = (u) => omit(u, SAFE_FIELDS);

const createUserSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(Object.values(ROLES)),
  department: z.string().max(100).optional().default(''),
  specialty: z.string().max(100).optional(),
  phone: z.string().max(20).optional().default(''),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  department: z.string().max(100).optional(),
  specialty: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  isActive: z.boolean().optional(),
});

// ─── GET /api/users ───────────────────────────────────────────────────────────
const listUsers = async (req, res, next) => {
  try {
  const { search, role, page = 1, limit = 20 } = req.query;
  const all = await userRepo.findAll({ search, role });
  const { items, meta } = paginate(all, page, limit);
  return success(res, items.map(sanitize), 'OK', 200, meta);
  } catch (err) { next(err); }
};

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
const getUser = async (req, res, next) => {
 try {
  const user = await userRepo.findById(req.params.id);
  if (!user) return notFound(res, 'User not found');
  return success(res, sanitize(user));
 } catch (err) { next(err); }
};

// ─── POST /api/users ──────────────────────────────────────────────────────────
const createUser = async (req, res, next) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.errors });
    }
    const data = parsed.data;

    // Prevent privilege escalation — only Admin can create Admin users
    if (data.role === ROLES.ADMIN && req.session.role !== ROLES.ADMIN) {
      return forbidden(res);
    }

    const existing = await userRepo.findByEmail(data.email);
    if (existing) return conflict(res, 'Email already in use');

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await userRepo.create({ ...omit(data, ['password']), passwordHash });

    const graphSynchronized = data.role === ROLES.DOCTOR ? await syncDoctor(user) : true;
    return created(res, { ...sanitize(user), graphSynchronized }, 'User created');
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return conflict(res, 'Email already in use');
    }
    next(err);
  }
};

// ─── PATCH /api/users/:id ─────────────────────────────────────────────────────
const updateUser = async (req, res, next) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.errors });
    }
    const user = await userRepo.findById(req.params.id);
    if (!user) return notFound(res, 'User not found');

    const updated = await userRepo.update(req.params.id, parsed.data);

    return success(res, sanitize(updated), 'User updated');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/users/doctors ───────────────────────────────────────────────────
const listDoctors = async (req, res, next) => {
 try {
  const doctors = await userRepo.findAll({ role: ROLES.DOCTOR, isActive: true });
  return success(res, doctors.map(sanitize));
 } catch (err) { next(err); }
};

module.exports = { listUsers, getUser, createUser, updateUser, listDoctors };
