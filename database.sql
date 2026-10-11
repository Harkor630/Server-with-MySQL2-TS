CREATE DATABASE IF NOT EXISTS products_db;
USE products_db;
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  description TEXT NOT NULL,
  brand VARCHAR(100) NULL,
  img VARCHAR(500) NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);
INSERT INTO products (name, price, stock, description, brand, img)
VALUES ('Producto demo', 99.90, 10, 'Producto para probar la API', 'Demo', NULL);
