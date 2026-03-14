SELECT 
    routine_name, 
    routine_definition 
FROM 
    information_schema.routines 
WHERE 
    routine_type = 'FUNCTION' 
    AND routine_name = 'link_photo_to_lead';
