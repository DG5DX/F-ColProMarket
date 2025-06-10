<template>
  <q-layout>
    <q-page-container>
      <q-page class="custom-page">
              <q-btn 
        icon="arrow_back" 
        flat 
        round 
        dense 
        class="back-btn"
        @click="$router.go(-1)"
      />
        <div class="row q-col-gutter-md">
          <!-- Sección principal -->
          <div class="col-12">
            <q-card class="hero-card">
              <q-card-section class="hero-section">
                <div class="hero-content">
                  <div class="text-h3 hero-title">ColProductMarket</div>
                  <div class="text-h6 hero-subtitle">Soluciones digitales para tu negocio</div>
                </div>
                <div class="hero-decoration"></div>
              </q-card-section>

              <q-separator />

              <q-card-section class="intro-section">
                <q-banner rounded class="custom-banner">
                  <template v-slot:avatar>
                    <q-icon name="groups" class="banner-icon" size="lg" />
                  </template>
                  <div class="banner-text">
                    Somos un equipo multidisciplinario especializado en desarrollo de marketplaces y soluciones e-commerce.
                  </div>
                </q-banner>
              </q-card-section>
            </q-card>
          </div>

          <!-- Quiénes somos -->
          <div class="col-12 col-md-8">
            <q-card class="content-card">
              <q-card-section>
                <div class="section-title">Quiénes somos</div>
                <div class="section-content">
                  <p>
                    ColProductMarket es un equipo de aprendices con más de 3 años de experiencia en el desarrollo
                    de software. Nos especializamos en crear soluciones
                    personalizadas que se adaptan a las necesidades específicas de cada negocio.
                  </p>
                  <p>
                    Nuestro equipo combina experiencia en desarrollo web, diseño UX/UI, marketing digital
                    y análisis de datos para ofrecer productos de alta calidad.
                  </p>
                </div>

                <div class="stats-grid q-mt-lg">
                  <div class="stat-item" v-for="(stat, index) in stats" :key="index">
                    <q-icon :name="stat.icon" class="stat-icon" />
                    <div class="stat-content">
                      <div class="stat-value">{{ stat.value }}</div>
                      <div class="stat-label">{{ stat.label }}</div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Equipo -->
            <q-card class="content-card q-mt-md">
              <q-card-section>
                <div class="section-title">Nuestro equipo</div>
                <div class="team-grid">
                  <div class="team-member" v-for="member in team" :key="member.id">
                    <q-card class="member-card">
                      <div class="member-avatar-container">
                        <q-img :src="member.avatar" class="member-avatar" />
                      </div>

                      <q-card-section class="member-info">
                        <div class="member-name">{{ member.name }}</div>
                        <div class="member-position">{{ member.position }}</div>
                        <div class="member-skills">
                          <q-chip 
                            v-for="(skill, i) in member.skills" 
                            :key="i" 
                            class="skill-chip"
                            dense
                          >
                            {{ skill }}
                          </q-chip>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Contacto y datos -->
          <div class="col-12 col-md-4">
            <q-card class="sidebar-card">
              <q-card-section>
                <div class="section-title">Contacto</div>
                
                <div class="contact-list">
                  <div class="contact-item">
                    <q-icon name="email" class="contact-icon" />
                    <div class="contact-content">
                      <div class="contact-label">Email</div>
                      <div class="contact-value">colproductmarket@gmail.com</div>
                    </div>
                  </div>

                  <div class="contact-item">
                    <q-icon name="phone" class="contact-icon" />
                    <div class="contact-content">
                      <div class="contact-label">Teléfono</div>
                      <div class="contact-value">+57 123 456 789</div>
                    </div>
                  </div>

                  <div class="contact-item">
                    <q-icon name="location_on" class="contact-icon" />
                    <div class="contact-content">
                      <div class="contact-label">Dirección</div>
                      <div class="contact-value">Av. Digital 123, Santander</div>
                    </div>
                  </div>

                  <div class="contact-item">
                    <q-icon name="schedule" class="contact-icon" />
                    <div class="contact-content">
                      <div class="contact-label">Horario</div>
                      <div class="contact-value">L-V: 9:00 - 18:00</div>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="social-section">
                <div class="social-title">Síguenos</div>
                <div class="social-buttons">
                  <q-btn 
                    round 
                    class="social-btn facebook" 
                    icon="fa-brands fa-facebook-f" 
                    type="a"
                    href="https://facebook.com" 
                    target="_blank"
                  />
                  <q-btn 
                    round 
                    class="social-btn twitter" 
                    icon="fa-brands fa-twitter" 
                    type="a"
                    href="https://twitter.com" 
                    target="_blank"
                  />
                  <q-btn 
                    round 
                    class="social-btn instagram" 
                    icon="fa-brands fa-instagram" 
                    type="a"
                    href="https://instagram.com" 
                    target="_blank"
                  />
                  <q-btn 
                    round 
                    class="social-btn linkedin" 
                    icon="fa-brands fa-linkedin-in" 
                    type="a"
                    href="https://linkedin.com" 
                    target="_blank"
                  />
                </div>
              </q-card-section>
            </q-card>

            <!-- Proyectos recientes -->
            <q-card class="sidebar-card q-mt-md">
              <q-card-section>
                <div class="section-title">Proyectos recientes</div>
                <div class="projects-timeline">
                  <div 
                    class="project-item"
                    v-for="project in projects" 
                    :key="project.id"
                  >
                    <div class="project-icon-container">
                      <q-icon :name="project.icon" class="project-icon" />
                    </div>
                    <div class="project-content">
                      <div class="project-name">{{ project.name }}</div>
                      <div class="project-date">{{ project.date }}</div>
                      <div class="project-description">{{ project.description }}</div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';

// Estadísticas del equipo
const stats = ref([
  { icon: 'store', label: 'Proyectos completados', value: '150+' },
  { icon: 'emoji_people', label: 'Clientes satisfechos', value: '85+' },
  { icon: 'code', label: 'Líneas de código', value: '1M+' },
  { icon: 'public', label: 'Países de operación', value: '12' }
]);

// Miembros del equipo
const team = ref([
  {
    id: 1,
    name: 'Andres Felipe',
    position: 'CEO & Fundador',
    skills: ['Estrategia', 'Negocios', 'Liderazgo'],
    avatar: new URL('../assets/Andres.jpeg', import.meta.url).href
  },
  {
    id: 2,
    name: 'Bryan Zarate',
    position: 'CTO',
    skills: ['Vue', 'Node.js', 'Arquitectura'],
    avatar: new URL('../assets/Bryan.jpeg', import.meta.url).href
  },
  {
    id: 3,
    name: 'Daniel Fernando',
    position: 'Diseñador UX/UI',
    skills: ['Figma', 'Prototipado', 'Research'],
    avatar: new URL('../assets/Daniel.jpeg', import.meta.url).href
  },
  {
    id: 4,
    name: 'Jhaider Ortiz',
    position: 'Desarrollador Frontend',
    skills: ['Vue', 'Quasar', 'JavaScript'],
    avatar: new URL('../assets/Jhaider.jpeg', import.meta.url).href
  },
]);

// Proyectos recientes
const projects = ref([
  {
    id: 1,
    name: 'EcoMarket - Marketplace ecológico',
    date: 'Enero 2023',
    description: 'Plataforma de comercio de productos sostenibles y ecológicos.',
    icon: 'eco'
  },
  {
    id: 2,
    name: 'ArtisanHub - Plataforma para artesanos',
    date: 'Septiembre 2022',
    description: 'Marketplace para conectar artesanos con compradores internacionales.',
    icon: 'handyman'
  },
  {
    id: 3,
    name: 'TechBazaar - Tienda de electrónica',
    date: 'Marzo 2022',
    description: 'Solución completa de e-commerce para una cadena de electrónica.',
    icon: 'computer'
  }
]);
</script>

<style scoped>
:root {
  --one-color--: #FBFBFB;
  --two-color--: #E8F9FF;
  --three-color--: #C4D9FF;
  --four-color--: #C5BAFF;
  --cambio--: #8E7DBE;
  --six-color--: #cdcbfc;
  --seven-color--: #3813f0;
  --text-primary: #333;
  --text-secondary: #666;
  --background: #f9f9f9;
  --card-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  --border-color: #ddd;
  --five-color--: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  --fiv-color--: #1976d2;
}

.custom-page {
  background: linear-gradient(135deg, var(--three-color--) 0%, var(--two-color--) 100%);
  min-height: 100vh;
  padding: 2rem;
}

/* Hero Section */
.hero-card {
  background: linear-gradient(135deg, var(--one-color--) 0%, var(--two-color--) 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.hero-section {
  background: var(--five-color--);
  color: white;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  opacity: 0.9;
  font-weight: 300;
}

.hero-decoration {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 1;
}

.intro-section {
  padding: 2rem;
}

.back-btn {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
}

.custom-banner {
  background: linear-gradient(135deg, var(--four-color--) 0%, var(--six-color--) 100%);
  border: none;
  border-radius: 15px;
  padding: 1.5rem;
}

.banner-icon {
  color: var(--seven-color--);
}

.banner-text {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Content Cards */
.content-card, .sidebar-card {
  background: var(--one-color--);
  border-radius: 15px;
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--seven-color--);
  margin-bottom: 1.5rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 50px;
  height: 3px;
  background: var(--five-color--);
  border-radius: 2px;
}

.section-content {
  color: var(--text-primary);
  line-height: 1.7;
}

.section-content p {
  margin-bottom: 1rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--two-color--) 0%, var(--four-color--) 100%);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2.5rem;
  color: var(--seven-color--);
  margin-right: 1rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--seven-color--);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Team Grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.member-card {
  background: var(--one-color--);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(142, 125, 190, 0.2);
}

.member-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.member-avatar-container {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: center;
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--cambio--);
}

.member-info {
  text-align: center;
  padding: 1rem 1.5rem 1.5rem;
}

.member-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.member-position {
  color: var(--seven-color--);
  font-weight: 500;
  margin-bottom: 1rem;
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.skill-chip {
  background: var(--cambio--);
  color: white;
  font-size: 0.75rem;
  border-radius: 20px;
}

/* Contact Section */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--two-color--) 0%, rgba(255, 255, 255, 0.5) 100%);
  border-radius: 10px;
  transition: transform 0.2s ease;
}

.contact-item:hover {
  transform: translateX(5px);
}

.contact-icon {
  font-size: 1.5rem;
  color: var(--seven-color--);
  margin-right: 1rem;
  min-width: 24px;
}

.contact-content {
  flex: 1;
}

.contact-label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.contact-value {
  color: var(--text-primary);
  font-weight: 600;
  margin-top: 0.25rem;
}

/* Social Section */
.social-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.social-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-align: center;
}

.social-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.social-btn {
  width: 44px;
  height: 44px;
  transition: all 0.3s ease;
  color: white !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.social-btn.facebook { 
  background: #1877f2; 
}
.social-btn.facebook:hover { 
  background: #166fe5; 
}

.social-btn.twitter { 
  background: #1da1f2; 
}
.social-btn.twitter:hover { 
  background: #1a95e0; 
}

.social-btn.instagram { 
  background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
}
.social-btn.instagram:hover { 
  opacity: 0.9; 
}

.social-btn.linkedin { 
  background: #0077b5; 
}
.social-btn.linkedin:hover { 
  background: #00669c; 
}

/* Projects Timeline */
.projects-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.project-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--six-color--) 0%, rgba(255, 255, 255, 0.5) 100%);
  border-radius: 10px;
  transition: transform 0.2s ease;
}

.project-item:hover {
  transform: translateY(-2px);
}

.project-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--seven-color--);
  border-radius: 50%;
  flex-shrink: 0;
}

.project-icon {
  color: white;
  font-size: 1.2rem;
}

.project-content {
  flex: 1;
}

.project-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.project-date {
  font-size: 0.85rem;
  color: var(--seven-color--);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.project-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-page {
    padding: 1rem;
  }
  
  .hero-section {
    padding: 2rem 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .social-buttons {
    justify-content: center;
  }
}
</style>