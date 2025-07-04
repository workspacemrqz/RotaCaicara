-- Reset script to ensure all 14 categories are properly seeded
-- Run this script to reset the database with correct data

-- Clear existing data
DELETE FROM businesses;
DELETE FROM categories;
DELETE FROM settings;
DELETE FROM sessions;

-- Reset sequences
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE businesses_id_seq RESTART WITH 1;
ALTER SEQUENCE settings_id_seq RESTART WITH 1;

-- Insert all 14 Rota Caiçara categories
INSERT INTO categories (name, slug, icon, color, active) VALUES
('PARA SUA REFEIÇÃO', 'para-sua-refeicao', '🍽️', '#006C84', true),
('PARA SUA CASA', 'para-sua-casa', '🏠', '#006C84', true),
('PARA SUA EMPRESA', 'para-sua-empresa', '🏭', '#006C84', true),
('PARA SUA SAÚDE', 'para-sua-saude', '💚', '#006C84', true),
('PARA SEU AUTOMÓVEL', 'para-seu-automovel', '🚗', '#006C84', true),
('PARA SUA BELEZA', 'para-sua-beleza', '💄', '#006C84', true),
('PARA SEU BEBÊ', 'para-seu-bebe', '👶', '#006C84', true),
('PARA SEU PET', 'para-seu-pet', '🐕', '#006C84', true),
('PARA SUA EDUCAÇÃO', 'para-sua-educacao', '✏️', '#006C84', true),
('PARA SEU CORPO', 'para-seu-corpo', '🏋️', '#006C84', true),
('PARA SUA FESTA', 'para-sua-festa', '🎂', '#006C84', true),
('PARA SUA VIAGEM', 'para-sua-viagem', '🏖️', '#006C84', true),
('PARA SUA DIVERSÃO', 'para-sua-diversao', '🎭', '#006C84', true),
('NOVIDADES NA CIDADE', 'novidades-na-cidade', '⭐', '#006C84', true);

-- Insert sample businesses for each category
INSERT INTO businesses (name, description, phone, whatsapp, address, email, website, instagram, facebook, journal_link, category_id, image_url, featured, certified, active) VALUES
('Restaurante do Caiçara', 'Especialidades em frutos do mar e pratos típicos da região. Ambiente familiar com vista para o mar.', '(12) 99999-1234', '5512999991234', 'Rua das Flores, 123 - Centro, São Sebastião', 'contato@restaurantecaicara.com.br', null, 'restaurantecaicara', 'restaurantecaicarass', '', 1, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', true, true, true),

('Casa & Construção São Sebastião', 'Material de construção, ferramentas e acabamentos para sua casa dos sonhos.', '(12) 99999-5678', '5512999995678', 'Av. Atlântica, 456 - Praia Grande, São Sebastião', 'contato@casaconstrucao.com.br', null, 'casaconstrucaoss', null, '', 2, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400', true, true, true),

('Consultoria Empresarial Litoral', 'Consultoria em gestão, marketing digital e desenvolvimento empresarial para negócios locais.', '(12) 99999-9012', '5512999999012', 'Rua do Comércio, 789 - Centro Histórico, São Sebastião', null, null, 'consultorialitoral', 'consultorialitoral', '', 3, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', false, true, true),

('Clínica de Saúde Integrada', 'Atendimento médico completo com especialistas em medicina preventiva e tratamentos naturais.', '(12) 99999-3456', '5512999993456', 'Estrada da Balsa, 321 - Bertioga, São Sebastião', 'contato@clinicasaude.com.br', null, null, null, '', 4, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', false, false, true),

('Auto Peças e Serviços', 'Peças automotivas, manutenção e serviços especializados para todos os tipos de veículos.', '(12) 99999-7890', '5512999997890', 'Rua da Natureza, 654 - Maresias, São Sebastião', 'autopecas@litoral.com.br', null, 'autopecaslitoral', null, '', 5, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', true, true, true),

('Estética e Beleza Maresias', 'Tratamentos estéticos, massagens relaxantes e cuidados com a beleza em ambiente tranquilo.', '(12) 99999-2468', '5512999992468', 'Av. Beira Mar, 987 - Juquehy, São Sebastião', null, null, 'esteticamaresias', null, '', 6, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400', false, true, true);

-- Insert default site settings
INSERT INTO settings (site_name, locality, headline1, headline2, headline3, headline4, tagline1, tagline2, tagline3, tagline4, phone, email, address, instagram_url, whatsapp_url, facebook_url, whatsapp, website, instagram, facebook, faq1_question, faq1_answer, faq2_question, faq2_answer, faq3_question, faq3_answer, faq4_question, faq4_answer, updated_at) VALUES
('Rota Caiçara', 'São Sebastião', 'DESCUBRA AS MELHORES EMPRESAS', 'DE SÃO SEBASTIÃO', 'CONECTANDO VOCÊ AOS MELHORES', 'NEGÓCIOS DA CIDADE', 'Conectando você aos melhores negócios da cidade', 'Descubra, conecte-se, prospere', 'Sua empresa na palma da mão', 'O futuro do comércio local', '(12) 99999-0000', 'contato@rotacaicara.com.br', 'São Sebastião, SP', 'https://instagram.com/rotacaicara', 'https://wa.me/5512999999999', 'https://facebook.com/rotacaicara', null, null, null, null, 'Como funciona o cadastro?', 'É simples e gratuito. Basta preencher o formulário com os dados do seu negócio.', 'Quanto custa para anunciar?', 'O cadastro básico é gratuito. Temos planos premium com recursos adicionais.', 'Como edito meu anúncio?', 'Entre em contato conosco através do WhatsApp ou email para alterações.', 'Posso ter mais de um negócio cadastrado?', 'Sim, você pode cadastrar múltiplos negócios usando o mesmo formulário.', NOW());