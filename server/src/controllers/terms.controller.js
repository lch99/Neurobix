'use strict';

const { Term, Class } = require('../db/models');

function serializeTerm(term) {
  return {
    id: term.id,
    name: term.name,
    startDate: term.start_date,
    endDate: term.end_date,
    status: term.status,
    classCount: term.classes ? term.classes.length : undefined,
  };
}

const INCLUDE = [{ model: Class, as: 'classes', attributes: ['id'] }];

async function listTerms(req, res) {
  const terms = await Term.findAll({
    include: INCLUDE,
    order: [['start_date', 'ASC']],
  });

  return res.json(terms.map(serializeTerm));
}

async function createTerm(req, res) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { name, startDate, endDate, status } = req.body;
  if (!name || !startDate || !endDate) {
    return res.status(400).json({ message: 'name, startDate and endDate are required' });
  }

  const term = await Term.create({
    name,
    start_date: startDate,
    end_date: endDate,
    status: status || 'upcoming',
  });

  return res.status(201).json(serializeTerm(term));
}

async function updateTerm(req, res) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const term = await Term.findByPk(req.params.id, { include: INCLUDE });
  if (!term) return res.status(404).json({ message: 'Term not found' });

  const { name, startDate, endDate, status } = req.body;

  await term.update({
    name: name ?? term.name,
    start_date: startDate ?? term.start_date,
    end_date: endDate ?? term.end_date,
    status: status ?? term.status,
  });

  return res.json(serializeTerm(term));
}

async function deleteTerm(req, res) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const term = await Term.findByPk(req.params.id);
  if (!term) return res.status(404).json({ message: 'Term not found' });

  await term.destroy();
  return res.status(204).send();
}

module.exports = { listTerms, createTerm, updateTerm, deleteTerm };
