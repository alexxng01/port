-- database.sql - Neon PostgreSQL Schema
-- Run this in Neon SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Portfolio data table (JSONB for flexibility)
CREATE TABLE IF NOT EXISTS portfolio_data (
    id SERIAL PRIMARY KEY,
    data_key VARCHAR(100) UNIQUE NOT NULL,
    data_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_portfolio_data_key ON portfolio_data(data_key);
CREATE INDEX IF NOT EXISTS idx_portfolio_data_updated ON portfolio_data(updated_at);

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45),
    city VARCHAR(100),
    country VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    visit_date DATE,
    visit_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for visitors
CREATE INDEX IF NOT EXISTS idx_visitors_date ON visitors(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitors_ip ON visitors(ip_address);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_created ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_read ON contact_messages(is_read);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: Admin@123)
INSERT INTO admin_users (email, password, name, role) VALUES 
('rm91275@gmail.com', 'Admin@123', 'Rahul Mahato', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default portfolio data
INSERT INTO portfolio_data (data_key, data_value) VALUES 
('portfolio_profile', '{"name":"Rahul Mahato","title":"Full Stack Developer","bio":"Web Developer","email":"rm91275@gmail.com","image":"./images/ME.jpeg"}'::jsonb),
('portfolio_services', '[{"id":1,"icon":"bx bx-code","title":"Web Development","description":"Modern responsive websites."}]'::jsonb),
('portfolio_skills_technical', '[{"id":1,"name":"HTML5","level":90,"icon":"bx bxl-html5"}]'::jsonb),
('portfolio_skills_professional', '[{"id":1,"name":"Creativity","level":90}]'::jsonb),
('portfolio_projects', '[{"id":1,"title":"E-Commerce Dashboard","description":"Modern admin dashboard."}]'::jsonb),
('portfolio_teamwork', '[{"id":1,"title":"Open Source","description":"Contributor","role":"Contributor"}]'::jsonb)
ON CONFLICT (data_key) DO NOTHING;

-- Create a view for dashboard stats
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM visitors) as total_visitors,
    (SELECT COUNT(*) FROM visitors WHERE visit_date = CURRENT_DATE) as today_visitors,
    (SELECT COUNT(*) FROM contact_messages) as total_messages,
    (SELECT COUNT(*) FROM contact_messages WHERE is_read = FALSE) as unread_messages,
    (SELECT COUNT(*) FROM portfolio_data) as total_sections;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for portfolio_data
CREATE TRIGGER update_portfolio_data_updated_at 
    BEFORE UPDATE ON portfolio_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();