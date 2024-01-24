--Customer Page
/* 
Customer Name 
Age
Email
location
*/

CREATE TABLE customer(
    customer_id serial primary key,
    customer_name varchar(100),
    age numeric check (age>0 and age<100),
    email varchar(100) unique,
    cust_date timestamp default current_timestamp
);

INSERT INTO customer (customer_name,age,email) 
values ('virat',35,'virat@gmail.com');

SELECT * FROM customer;
SELECT customer_name,age FROM customer;

--Product Page

CREATE TABLE product(
    product_id serial primary key,
    product_name varchar(100)
);

--Inventory Page

CREATE TABLE inventory(
    inventory_id serial primary key,
    product_id integer references product(product_id),
    quantity numeric check (quantity>=0),
    inventory_update timestamp default current_timestamp
);

--Invoice Page

CREATE TABLE invoice(
    invoice_id serial primary key,
    customer_id integer references customer(customer_id),
    product_id integer references product(product_id),
    quantity integer check (quantity>=0),
    price integer check (price >0),
    inv_date timestamp default current_timestamp
);