const { pool } = require("../config/database.js");

//Get all Courses

exports.getAllCourses = async (skip, limit, search) => {
  const searchQuery = search ? `%${search}%` : null;
  const result = await pool.query(
    `SELECT * FROM courses WHERE ($3::text IS NULL OR title ILIKE $3) LIMIT $1 OFFSET $2`,
    [limit, skip, searchQuery],
  );

  return result.rows;
};

//Get single Course

exports.getCourseById = async (id) => {
  const result = await pool.query(`SELECT * FROM courses WHERE id =$1`, [id]);

  return result.rows[0];
};

//Create Course

exports.createCourse = async (
  instructor_id,
  category_id,
  title,
  subtitle,
  description,
  price,
  level,
  thumbnail_url,
  language,
  is_published,
) => {
  const result = await pool.query(
    `INSERT INTO courses (instructor_id,category_id,title,subtitle,description,price,level,thumbnail_url,language,is_published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [
      instructor_id,
      category_id,
      title,
      subtitle,
      description,
      price,
      level,
      thumbnail_url,
      language,
      is_published,
    ],
  );

  return result.rows[0];
};

//Update Course

exports.updateCourse = async (
  id,
  instructor_id,
  category_id,
  title,
  subtitle,
  description,
  price,
  level,
  thumbnail_url,
  language,
  is_published,
) => {
  const result = await pool.query(
    `UPDATE courses SET 
    instructor_id = COALESCE($1, instructor_id),
    category_id = COALESCE($2, category_id),
    title = COALESCE($3, title),
    subtitle = COALESCE($4, subtitle),
    description = COALESCE($5, description),
    price = COALESCE($6, price),
    level = COALESCE($7, level),
    thumbnail_url = COALESCE($8, thumbnail_url),
    language = COALESCE($9, language),
    is_published = COALESCE($10, is_published) 
    WHERE id = $11 RETURNING *`,
    [
      instructor_id,
      category_id,
      title,
      subtitle,
      description,
      price,
      level,
      thumbnail_url,
      language,
      is_published,
      id,
    ],
  );

  return result.rows[0];
};

//Delete Course

exports.deleteCourse = async (id) => {
  const result = await pool.query(
    `DELETE FROM courses WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};
