import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  try {
    console.log('Initializing database tables...');
    
    // Create all necessary tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        icon TEXT NOT NULL,
        color TEXT DEFAULT '#006C84',
        background_image TEXT,
        active BOOLEAN DEFAULT true
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        phone TEXT,
        whatsapp TEXT,
        address TEXT,
        email TEXT,
        website TEXT,
        instagram TEXT,
        facebook TEXT,
        journal_link TEXT,
        category_id INTEGER NOT NULL,
        image_url TEXT,
        featured BOOLEAN DEFAULT false,
        certified BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS business_registrations (
        id SERIAL PRIMARY KEY,
        business_name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        phone TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        address TEXT NOT NULL,
        description TEXT NOT NULL,
        instagram TEXT,
        facebook TEXT,
        contact_email TEXT,
        image_url TEXT,
        processed BOOLEAN DEFAULT false
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        site_name TEXT NOT NULL DEFAULT 'Rota Caiçara',
        locality TEXT NOT NULL DEFAULT 'São Sebastião',
        headline1 TEXT NOT NULL DEFAULT 'DESCUBRA AS MELHORES EMPRESAS',
        headline2 TEXT NOT NULL DEFAULT 'DE SÃO SEBASTIÃO',
        headline3 TEXT NOT NULL DEFAULT 'CONECTANDO VOCÊ AOS MELHORES',
        headline4 TEXT NOT NULL DEFAULT 'NEGÓCIOS DA CIDADE',
        tagline1 TEXT NOT NULL DEFAULT 'Conectando você aos melhores negócios da cidade',
        tagline2 TEXT NOT NULL DEFAULT 'Descubra, conecte-se, prospere',
        tagline3 TEXT NOT NULL DEFAULT 'Sua empresa na palma da mão',
        tagline4 TEXT NOT NULL DEFAULT 'O futuro do comércio local',
        phone TEXT NOT NULL DEFAULT '(12) 99999-0000',
        email TEXT NOT NULL DEFAULT 'contato@rotacaicara.com.br',
        address TEXT NOT NULL DEFAULT 'São Sebastião, SP',
        instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/rotacaicara',
        whatsapp_url TEXT NOT NULL DEFAULT 'https://wa.me/5512999999999',
        facebook_url TEXT NOT NULL DEFAULT 'https://facebook.com/rotacaicara',
        whatsapp TEXT,
        website TEXT,
        instagram TEXT,
        facebook TEXT,
        faq1_question TEXT NOT NULL DEFAULT 'Como funciona o cadastro?',
        faq1_answer TEXT NOT NULL DEFAULT 'É simples e gratuito. Basta preencher o formulário com os dados do seu negócio.',
        faq2_question TEXT NOT NULL DEFAULT 'Quanto custa para anunciar?',
        faq2_answer TEXT NOT NULL DEFAULT 'O cadastro básico é gratuito. Temos planos premium com recursos adicionais.',
        faq3_question TEXT NOT NULL DEFAULT 'Como edito meu anúncio?',
        faq3_answer TEXT NOT NULL DEFAULT 'Entre em contato conosco através do WhatsApp ou email para alterações.',
        faq4_question TEXT NOT NULL DEFAULT 'Posso ter mais de um negócio cadastrado?',
        faq4_answer TEXT NOT NULL DEFAULT 'Sim, você pode cadastrar múltiplos negócios usando o mesmo formulário.',
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        data JSON,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        site_name TEXT NOT NULL DEFAULT 'Rota Caiçara',
        locality TEXT NOT NULL DEFAULT 'São Sebastião',
        headline1 TEXT NOT NULL DEFAULT 'DESCUBRA AS MELHORES EMPRESAS',
        headline2 TEXT NOT NULL DEFAULT 'DE SÃO SEBASTIÃO',
        headline3 TEXT NOT NULL DEFAULT 'CONECTANDO VOCÊ AOS MELHORES',
        headline4 TEXT NOT NULL DEFAULT 'NEGÓCIOS DA CIDADE',
        tagline1 TEXT NOT NULL DEFAULT 'Conectando você aos melhores negócios da cidade',
        tagline2 TEXT NOT NULL DEFAULT 'Descubra, conecte-se, prospere',
        tagline3 TEXT NOT NULL DEFAULT 'Sua empresa na palma da mão',
        tagline4 TEXT NOT NULL DEFAULT 'O futuro do comércio local',
        phone TEXT NOT NULL DEFAULT '(12) 99999-0000',
        email TEXT NOT NULL DEFAULT 'contato@rotacaicara.com.br',
        address TEXT NOT NULL DEFAULT 'São Sebastião, SP',
        logo_url TEXT NOT NULL DEFAULT 'https://i.ibb.co/LhhDX2hz/Logo-1.jpg',
        instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/rotacaicara',
        whatsapp_url TEXT NOT NULL DEFAULT 'https://wa.me/5512999999999',
        facebook_url TEXT NOT NULL DEFAULT 'https://facebook.com/rotacaicara',
        footer_description TEXT NOT NULL DEFAULT 'Conectando você às melhores empresas da cidade com sustentabilidade e qualidade.',
        advertise_headline TEXT NOT NULL DEFAULT 'SUA MARCA EM DESTAQUE ENTRE AS MELHORES',
        advertise_subtitle1 TEXT NOT NULL DEFAULT 'Onde excelência encontra visibilidade!',
        advertise_subtitle2 TEXT NOT NULL DEFAULT 'Junte-se à nossa comunidade sustentável e fortaleça sua reputação empresarial com divulgação multicanal eficiente e impactante.',
        faq1_question TEXT NOT NULL DEFAULT 'Posso parcelar no cartão?',
        faq1_answer TEXT NOT NULL DEFAULT 'Sim, aceitamos parcelamento no cartão de crédito para facilitar seu investimento em marketing.',
        faq2_question TEXT NOT NULL DEFAULT 'Quanto tempo leva para ativar o anúncio?',
        faq2_answer TEXT NOT NULL DEFAULT 'Após aprovação, seu anúncio fica ativo em até 24 horas úteis.',
        faq3_question TEXT NOT NULL DEFAULT 'Como retirar o certificado?',
        faq3_answer TEXT NOT NULL DEFAULT 'O certificado digital será enviado por email após aprovação do seu cadastro.',
        faq4_question TEXT NOT NULL DEFAULT 'Empresas de outras cidades podem anunciar?',
        faq4_answer TEXT NOT NULL DEFAULT 'Sim, desde que atendam nossa região ou ofereçam serviços para nossos usuários locais.',
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        image_url TEXT,
        cta_text TEXT,
        cta_link TEXT,
        active BOOLEAN DEFAULT true,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT,
        content TEXT NOT NULL,
        image_url TEXT,
        rating INTEGER DEFAULT 5,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        table_name TEXT,
        record_id INTEGER,
        old_values JSON,
        new_values JSON,
        user_agent TEXT,
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        business_id INTEGER,
        discount_percent INTEGER,
        valid_until TIMESTAMP,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        path TEXT NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        referrer TEXT,
        visited_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        image_url TEXT,
        source_name TEXT NOT NULL,
        published_at TIMESTAMP,
        active BOOLEAN DEFAULT true,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();