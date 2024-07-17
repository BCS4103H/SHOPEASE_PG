-- Example total_sales function (adjust as per your schema)
CREATE OR REPLACE FUNCTION total_sales(product_id integer)
RETURNS numeric AS $$
DECLARE
    total numeric;
BEGIN
    -- Example query to calculate total sales
    SELECT SUM(oi.price * oi.quantity)
    INTO total
    FROM order_items oi
    JOIN products p ON oi.id = p.id
    WHERE p.id = $1;

    RETURN COALESCE(total, 0); -- Return total sales, defaulting to 0 if no sales found
END;
$$ LANGUAGE plpgsql;
