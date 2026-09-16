/* Find all logistics where status equal success */
SELECT
  administrators.name as admin_name,
  customers.name as customer_name,
  street,
  number,
  status.name
  FROM logistics_request
    INNER JOIN administrators ON logistics_request.admin_id = administrators.id
    INNER JOIN customers ON logistics_request.customer_id = customers.id
    INNER JOIN `status` ON logistics_request.status_id = status.id
    INNER JOIN orders ON logistics_request.id = orders.logistic_request_id
  WHERE status.id = 1 /* vary by filter */


/* Find all solicitaion that belong to the custormer CPF */
SELECT
	*
  FROM logistics_request
  INNER JOIN customers ON	logistics_request.customer_id = customers.id
  WHERE customers.identification = '478.519.976-82'


/* Find all product that belong to the customer */
SELECT
	products.name,
  customers.name
  FROM orders_products
    INNER JOIN products ON orders_products.product_id = products.id
    INNER JOIN orders ON orders_products.order_id = orders.id
    INNER JOIN logistics_request ON orders.logistic_request_id = logistics_request.id
    INNER JOIN customers ON logistics_request.customer_id = customers.id
    WHERE customers.identification = '875.088.666-57'

/* */

SELECT
	addresses.street,
  products.name as product_name,
  customers.name as customer_name
	FROM addresses
    INNER JOIN logistics_request ON addresses.id = logistics_request.address_id
    INNER JOIN customers ON logistics_request.customer_id = customers.id
    INNER JOIN orders ON logistics_request.id = orders.logistic_request_id
    INNER JOIN orders_products ON orders.id = orders_products.order_id
    INNER JOIN products ON orders_products.id = products.id
    WHERE customers.identification = '1786.477.223-4523'
