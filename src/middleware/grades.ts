import { asyncMw } from 'express-asyncmw';

export const verifyPayloadMw = asyncMw(async (req, res, next) => {});

export const gradeImagesMw = asyncMw(async (req, res, next) => {});

export const returnGradesMw = asyncMw(async (req, res, next) => {});
