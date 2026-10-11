import { Request, Response } from 'express';
import pool from '../conf/dbConnection';

const idIsValid = (id: unknown): boolean => /^\d+$/.test(String(id)) && Number(id) > 0;
const priceIsValid = (price: unknown): boolean => price !== null && price !== '' && Number.isFinite(Number(price)) && Number(price) > 0;
const productDataIsValid = (body: any): boolean => {
  if (!body || typeof body !== 'object') return false;
  const required = ['name', 'price', 'stock', 'description'];
  return required.every((field) => body[field] !== undefined && body[field] !== null && body[field] !== '') && priceIsValid(body.price) && Number.isInteger(Number(body.stock)) && Number(body.stock) >= 0;
};
const notFound = (res: Response): void => { res.status(404).json({ ok: false, message: 'Producto no encontrado o inactivo' }); };

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try { const [rows] = await pool.execute('SELECT * FROM products WHERE active = ? ORDER BY id DESC', [true]); res.status(200).json({ ok: true, data: rows }); }
  catch (_error) { res.status(500).json({ ok: false, message: 'No se pudieron consultar los productos' }); }
};
export const getById = async (req: Request, res: Response): Promise<void> => {
  if (!idIsValid(req.params.id)) { res.status(400).json({ ok: false, message: 'El id debe ser un entero positivo' }); return; }
  try { const [rows]: any = await pool.execute('SELECT * FROM products WHERE id = ? AND active = ?', [Number(req.params.id), true]); if (!rows[0]) { notFound(res); return; } res.status(200).json({ ok: true, data: rows[0] }); }
  catch (_error) { res.status(500).json({ ok: false, message: 'No se pudo consultar el producto' }); }
};
export const create = async (req: Request, res: Response): Promise<void> => {
  if (!productDataIsValid(req.body)) { res.status(400).json({ ok: false, message: 'Datos inválidos. Revisa name, price, stock y description; price debe ser mayor que cero' }); return; }
  const { name, price, stock, description, brand = null, img = null } = req.body;
  try { const [result]: any = await pool.execute('INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)', [name, Number(price), Number(stock), description, brand, img]); res.status(201).json({ ok: true, message: 'Producto creado', id: result.insertId }); }
  catch (_error) { res.status(500).json({ ok: false, message: 'No se pudo crear el producto' }); }
};
export const update = async (req: Request, res: Response): Promise<void> => {
  if (!idIsValid(req.params.id)) { res.status(400).json({ ok: false, message: 'El id debe ser un entero positivo' }); return; }
  if (!productDataIsValid(req.body)) { res.status(400).json({ ok: false, message: 'Datos inválidos. Revisa name, price, stock y description; price debe ser mayor que cero' }); return; }
  const { name, price, stock, description, brand = null, img = null } = req.body;
  try { const [result]: any = await pool.execute('UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = ?', [name, Number(price), Number(stock), description, brand, img, Number(req.params.id), true]); if (!result.affectedRows) { notFound(res); return; } res.status(200).json({ ok: true, message: 'Producto actualizado' }); }
  catch (_error) { res.status(500).json({ ok: false, message: 'No se pudo actualizar el producto' }); }
};
export const remove = async (req: Request, res: Response): Promise<void> => {
  if (!idIsValid(req.params.id)) { res.status(400).json({ ok: false, message: 'El id debe ser un entero positivo' }); return; }
  try { const [result]: any = await pool.execute('UPDATE products SET active = ? WHERE id = ? AND active = ?', [false, Number(req.params.id), true]); if (!result.affectedRows) { notFound(res); return; } res.status(200).json({ ok: true, message: 'Producto dado de baja' }); }
  catch (_error) { res.status(500).json({ ok: false, message: 'No se pudo dar de baja el producto' }); }
};
export const changePrice = async (req: Request, res: Response): Promise<void> => {
  if (!idIsValid(req.params.id)) { res.status(400).json({ ok: false, message: 'El id debe ser un entero positivo' }); return; }
  if (!req.body || Object.keys(req.body).length !== 1 || !priceIsValid(req.body.price)) { res.status(400).json({ ok: false, message: 'El cuerpo debe contener únicamente price, numérico y mayor que cero' }); return; }
  try { const [result]: any = await pool.execute('UPDATE products SET price = ? WHERE id = ? AND active = ?', [Number(req.body.price), Number(req.params.id), true]); if (!result.affectedRows) { notFound(res); return; } res.status(200).json({ ok: true, message: 'Precio actualizado' }); }
  catch (_error) { res.status(500).json({ ok: false, message: 'No se pudo cambiar el precio' }); }
};
