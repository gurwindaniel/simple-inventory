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

INSERT INTO customer (customer_name,age,email)  values ('virat',35,'virat@gmail.com');

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



--update function
CREATE OR REPLACE FUNCTION updatecust(custid integer,customername varchar(100),ag numeric,eml varchar(100))
returns integer as
$$
DECLARE 
rec RECORD;    
BEGIN
    select customer_id,customer_name,age,email,cust_date into rec from customer where customer_id=custid;
    if(customername=rec.customer_name and ag=rec.age and eml=rec.email) then
    return 0;
    elseif(customername!=rec.customer_name and ag!=rec.age and eml!=rec.email) then
    update customer set customer_name=customername,age=ag,email=eml,cust_date=current_timestamp where customer_id=custid;
    elseif(customername!=rec.customer_name and ag!=rec.age) then
    update customer set customer_name=customername,age=ag,cust_date=current_timestamp where customer_id=custid;
    elseif(customername!=rec.customer_name and  eml!=rec.email) then
    update customer set customer_name=customername,email=eml,cust_date=current_timestamp where customer_id=custid;
    elseif(ag!=rec.age and eml!=rec.email) then
    update customer set age=ag,email=eml,cust_date=current_timestamp where customer_id=custid;
    elseif(customername!=rec.customer_name) then
    update customer set customer_name=customername,cust_date=current_timestamp where customer_id=custid;
    elseif(ag!=rec.age) then
    update customer set age=ag,cust_date=current_timestamp where customer_id=custid;
    elseif(eml!=rec.email) then
    update customer set email=eml,cust_date=current_timestamp where customer_id=custid;
    else
    return 3;
    end if;
return 1;
END;
$$ language 'plpgsql' STRICT;	

select updatecust(1,'daniel',34,'daniel@gmail.com')

CREATE TABLE roles(
    role_id serial primary key,
    role_name varchar
);

INSERT INTO roles (role_name) VALUES ('Admin');
INSERT INTO roles(role_name) VALUES ('Manager');

CREATE TABLE users(
    user_id serial primary key,
    name varchar,
    email varchar,
    role_id integer references roles(role_id),
    user_date timestamp default current_timestamp
);
alter table users add column password varchar;
INSERT INTO users (name,email,role_id) values ('virat','virat@gmail.com',1);
INSERT INTO users (name,email,role_id) values ('gurwin','gurwin@gmail.com',1);

--Duplicate email

CREATE OR REPLACE FUNCTION duplicate_email(eml varchar)
returns boolean AS $$
DECLARE
rec RECORD;
BEGIN
   select into rec  * from users where email=eml;
   if rec is not null then
   return True;
   else
   return false;
   end if;
   
END;
$$ language 'plpgsql' STRICT;

-- select duplicate_email('virat@gmail.com')




