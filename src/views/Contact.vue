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

            <!-- Nuestro equipo -->
            <q-card class="content-card q-mt-md">
              <q-card-section>
                <div class="section-title">Nuestro equipo</div>
                <div class="team-grid">
                  <div class="team-member" v-for="member in team" :key="member.id">
                    <q-card class="member-card">
                      <div class="member-avatar-container">
                        <q-img
                          :src="member.avatar"
                          class="member-avatar"
                          @click="openImage(member.avatar)"
                          style="cursor: pointer;"
                        />
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
                  <q-btn round class="social-btn facebook" icon="fa-brands fa-facebook-f" type="a" href="https://facebook.com" target="_blank" />
                  <q-btn round class="social-btn twitter" icon="fa-brands fa-twitter" type="a" href="https://twitter.com" target="_blank" />
                  <q-btn round class="social-btn instagram" icon="fa-brands fa-instagram" type="a" href="https://instagram.com" target="_blank" />
                  <q-btn round class="social-btn linkedin" icon="fa-brands fa-linkedin-in" type="a" href="https://linkedin.com" target="_blank" />
                </div>
              </q-card-section>
            </q-card>

            <q-card class="sidebar-card q-mt-md">
              <q-card-section>
                <div class="section-title">Proyectos recientes</div>
                <div class="projects-timeline">
                  <div class="project-item" v-for="project in projects" :key="project.id">
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

        <!-- Imagen ampliada tipo WhatsApp -->
        <q-dialog v-model="showDialog" persistent class="fullscreen-dialog">
          <div class="dialog-backdrop" @click="showDialog = false">
            <q-img :src="selectedImage" class="dialog-image" />
          </div>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  { icon: 'store', label: 'Proyectos completados', value: '150+' },
  { icon: 'emoji_people', label: 'Clientes satisfechos', value: '85+' },
  { icon: 'code', label: 'Líneas de código', value: '1M+' },
  { icon: 'public', label: 'Países de operación', value: '12' }
])

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
  }
])

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
])

const showDialog = ref(false)
const selectedImage = ref(null)

function openImage(imageUrl) {
  selectedImage.value = imageUrl
  showDialog.value = true
}
</script>

<style scoped>
@import url("../style/Contact.css");

.fullscreen-dialog .q-dialog__inner--minimized {
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-backdrop {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-image {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}
</style>
