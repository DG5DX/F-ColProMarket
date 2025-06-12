<template>
  <!-- Envuelve todo en QLayout -->
  <q-layout view="hHh Lpr lff">
    <!-- Barra de herramientas opcional -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="$router.go(-1)" />
        <q-toolbar-title>Perfil de Usuario</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer lateral -->
    <q-drawer
      v-model="leftDrawerOpen"
      :width="300"
      :breakpoint="700"
      bordered
      class="bg-grey-3"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :show-if-above="$q.screen.gt.sm"
    >
      <q-scroll-area class="fit" :thumb-style="{ width: '4px' }">
        <q-list padding>
          <q-item 
            clickable 
            v-ripple
            :active="activeTab === 'profile'"
            @click="activeTab = 'profile'"
            class="q-my-sm"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              Perfil
            </q-item-section>
          </q-item>

          <q-item 
            clickable 
            v-ripple
            :active="activeTab === 'movements'"
            @click="activeTab = 'movements'"
            class="q-my-sm"
          >
            <q-item-section avatar>
              <q-icon name="receipt" />
            </q-item-section>
            <q-item-section>
              Movimientos
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenido de la página -->
    <q-page-container>
      <q-page class="profile-page">
        <!-- Header con imagen de fondo -->
        <div class="profile-header bg-primary text-white">
          <q-parallax :height="200" :speed="0.5">
            <template v-slot:media>
              <img src="https://www.channelengine.com/hubfs/Blogs/2023-07/Marketplace%20strategy.jpg">
            </template>

            <div class="header-content absolute-full flex flex-center">
              <div class="header-overlay flex items-center q-px-lg" style="max-width: 1200px; width: 100%;">
                <!-- Avatar -->
                <q-avatar size="120px" class="q-mr-md">
                  <img :src="user.profilePicture !== 'N/A' ? user.profilePicture : 'https://ostermancron.com/wp-content/uploads/2016/02/blank-profile-picture-973460_640.png'">
                </q-avatar>

                <!-- Información básica -->
                <div class="text-white">
                  <h1 class="text-h4 q-mb-xs">{{ fullName }}</h1>
                  <div class="text-subtitle1 q-mb-sm">{{ user.email }}</div>
                  <div class="flex items-center q-gutter-sm">
                    <q-badge :color="user.state === 1 ? 'positive' : 'negative'">
                      {{ user.state === 1 ? 'Activo' : 'Inactivo' }}
                    </q-badge>
                    <q-badge :color="roleBadgeColor" class="text-white">
                      {{ roleName }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>
          </q-parallax>
        </div>

        <!-- Contenido principal basado en pestaña activa -->
        <template v-if="activeTab === 'profile'">
          <div class="profile-content q-pa-lg">
            <div class="row q-col-gutter-lg">
              <!-- Columna izquierda - Información personal -->
              <div class="col-12 col-md-6">
                <q-card class="my-card shadow-3">
                  <q-card-section class="bg-primary text-white flex justify-between items-center">
                    <div class="text-h6">Información Personal</div>
                    <q-btn 
                      icon="edit" 
                      flat 
                      round 
                      dense 
                      color="white" 
                      @click="openPersonalEditDialog"
                      title="Editar información personal"
                    />
                  </q-card-section>

                  <q-separator/>

                  <q-card-section>
                    <q-list bordered separator>
                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Nombre completo</q-item-label>
                          <q-item-label class="text-weight-medium">{{ fullName }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Correo electrónico</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.email }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Teléfono</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.phone !== 'N/A' ? user.phone : 'No especificado' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Fecha de nacimiento</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.dateOfBirth ? formatDate(user.dateOfBirth) : 'No especificada' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Género</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.gender !== 'No especificado' ? user.gender : 'No especificado' }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Columna derecha - Dirección y detalles de cuenta -->
              <div class="col-12 col-md-6">
                <!-- Tarjeta de dirección -->
                <q-card class="my-card q-mb-md shadow-3">
                  <q-card-section class="bg-primary text-white flex justify-between items-center">
                    <div class="text-h6">Dirección de Envío</div>
                    <q-btn 
                      icon="edit" 
                      flat 
                      round 
                      dense 
                      color="white" 
                      @click="openAddressEditDialog"
                      title="Editar dirección"
                    />
                  </q-card-section>

                  <q-separator/>

                  <q-card-section>
                    <q-list bordered separator>
                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Calle</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.shippingAddress?.street }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Ciudad</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.shippingAddress?.city }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Estado/Provincia</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.shippingAddress?.state }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Código Postal</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.shippingAddress?.zipCode !== 'N/A' ? user.shippingAddress?.zipCode : 'No especificado' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>País</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user.shippingAddress?.country }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>

                <!-- Tarjeta de detalles de cuenta -->
                <q-card class="my-card shadow-3">
                  <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Detalles de la Cuenta</div>
                  </q-card-section>

                  <q-separator/>

                  <q-card-section>
                    <q-list bordered separator>
                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>ID de Usuario</q-item-label>
                          <q-item-label class="text-weight-medium">{{ user._id }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Fecha de Creación</q-item-label>
                          <q-item-label class="text-weight-medium">{{ formatDate(user.createdAt) }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item class="q-pa-md">
                        <q-item-section>
                          <q-item-label caption>Última Actualización</q-item-label>
                          <q-item-label class="text-weight-medium">{{ formatDate(user.updatedAt) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </template>

        <!-- Contenido para movimientos -->
        <template v-else-if="activeTab === 'movements'">
          <div class="movements-content q-pa-lg">
            <q-card class="shadow-3">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">Movimientos del Usuario</div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-section>
                <q-page class="q-pa-md movements-viewer-page">
                  <div v-if="movements.length === 0" class="text-center text-grey-7 q-pa-lg empty-state">
                    <q-icon name="info" size="xl" class="q-mb-md" />
                    <p class="text-h6">No hay movimientos registrados.</p>
                    <p>Cuando realices una compra, aparecerá aquí.</p>
                  </div>

                  <q-list bordered class="rounded-borders movements-list">
                    <q-item
                      v-for="movement in movements"
                      :key="movement.paypalData ? movement.paypalData.id : movement._id"
                      class="q-mb-md movement-item"
                    >
                      <q-card flat bordered class="full-width movement-card shadow-1">
                        <q-card-section class="q-pb-none row items-center justify-between movement-header">
                          <div class="text-h6 text-primary">
                            <q-icon name="receipt" class="q-mr-sm" />
                            Movimiento ID:
                            <span class="movement-id">{{ movement.paypalData ? movement.paypalData.id : movement._id }}</span>
                          </div>
                          <div :class="['text-subtitle1', `status-${movement.status}`]">
                            <q-icon :name="getStatusIcon(movement.status)" class="q-mr-xs" />
                            Estado: <span class="status-text">{{ getStatusText(movement.status) }}</span>
                          </div>
                        </q-card-section>

                        <q-card-section class="q-pt-xs movement-details">
                          <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-6">
                              <p class="q-mb-xs">
                                <q-icon name="event" class="q-mr-xs" />
                                <span class="text-weight-bold">Fecha:</span> {{ formatDate(movement.createdAt) }}
                              </p>
                              <p class="q-mb-xs">
                                <q-icon name="update" class="q-mr-xs" />
                                <span class="text-weight-bold">Última Actualización:</span> {{ formatDate(movement.updatedAt) }}
                              </p>
                            </div>
                            <div class="col-12 col-md-6 text-right">
                              <p class="text-h5 text-weight-bold q-mb-xs total-amount">
                                <q-icon name="payments" class="q-mr-sm" />
                                Total: {{ formatCurrency(movement.total) }}
                              </p>
                              <p class="text-caption text-grey-6 q-mb-none" v-if="movement.paypalData">
                                Pago via PayPal ({{ movement.paypalData.intent }})
                              </p>
                            </div>
                          </div>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions align="left" class="q-pa-none">
                          <div class="full-width">
                            <!-- Botón para ver factura -->
                            <q-btn 
                              flat 
                              icon="eye" 
                              label="Ver Factura" 
                              color="primary"
                              class="full-width q-mb-sm"
                              @click="seeInvoice(movement)"
                            />
                            
                            <q-expansion-item
                              expand-separator
                              icon="shopping_bag"
                              label="Ver Productos"
                              class="full-width products-expansion"
                            >
                              <q-card-section class="q-pt-none product-list-section">
                                <q-list separator>
                                  <q-item
                                    v-for="(product, index) in movement.products"
                                    :key="index"
                                    class="product-item q-my-sm"
                                  >
                                    <q-item-section avatar>
                                      <q-avatar rounded size="60px">
                                        <img :src="product.images[0].urlImage || 'https://via.placeholder.com/60x60?text=No+Image'" alt="Product Image">
                                      </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                      <q-item-label class="text-weight-bold">{{ product.name }}</q-item-label>
                                      <q-item-label caption lines="2">{{ product.description }}</q-item-label>
                                      <q-item-label class="text-weight-medium">Cantidad: {{ product.quantity }}</q-item-label>
                                    </q-item-section>

                                    <q-item-section side top>
                                      <q-item-label class="text-body1 text-right">{{ formatCurrency(product.total) }}</q-item-label>
                                      <q-item-label caption v-if="product.discountPercentage">
                                        <span class="text-strike text-grey-6">{{ formatCurrency(product.subtotal) }}</span>
                                        <span class="text-positive q-ml-xs">(-{{ product.discountPercentage }}%)</span>
                                      </q-item-label>
                                    </q-item-section>
                                  </q-item>
                                </q-list>
                              </q-card-section>
                            </q-expansion-item>
                          </div>
                        </q-card-actions>
                      </q-card>
                    </q-item>
                  </q-list>
                </q-page>
              </q-card-section>
            </q-card>
          </div>
        </template>

        <!-- Botón flotante para mostrar/ocultar el drawer en pantallas pequeñas -->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            color="primary"
            :icon="leftDrawerOpen ? 'close' : 'menu'"
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            title="Mostrar/Ocultar menú"
            v-if="$q.screen.lt.md"
          />
        </q-page-sticky>

        <!-- Diálogo de edición de datos personales -->
        <q-dialog v-model="personalEditDialog" persistent>
          <q-card style="min-width: 70vw;">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>Editar Datos Personales</q-toolbar-title>
              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section>
              <q-form @submit="savePersonalInfo">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.name"
                      label="Nombre"
                      outlined
                      lazy-rules
                      :rules="[
                        val => !!val || 'El nombre es requerido',
                        val => val.length >= 2 || 'Mínimo 2 caracteres',
                        val => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val) || 'Solo letras y espacios'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.lastName"
                      label="Apellido"
                      outlined
                      :rules="[
                        val => !val || val.length >= 2 || 'Mínimo 2 caracteres',
                        val => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val) || 'Solo letras y espacios'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.email"
                      label="Correo electrónico"
                      type="email"
                      outlined
                      lazy-rules
                      :rules="[
                        val => !!val || 'El correo es requerido',
                        val => /.+@.+\..+/.test(val) || 'Correo no válido',
                        val => val.length <= 100 || 'Máximo 100 caracteres'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.phone"
                      label="Teléfono"
                      outlined
                      mask="(+57) ### #######"
                      unmasked-value
                      hint="Formato: (+57) XXX XXXXXX"
                      :rules="[
                        val => !!val || 'El teléfono es requerido',
                        val => !val || val.length === 10 || 'Deben ser 10 dígitos',
                        val => !val || /^[0-9]+$/.test(val) || 'Solo números permitidos'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.dateOfBirth"
                      label="Fecha de nacimiento"
                      outlined
                      type="date"
                      :rules="[
                        val => !!val || 'Debes poner tu fecha de nacimiento',
                        val => !val || isValidDate(val) || 'Fecha inválida',
                        val => !val || isAdult(val) || 'Debes ser mayor de 18 años',
                        val => !val || !isTooOld(val) || 'Fecha no válida'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="editForm.gender"
                      :options="genderOptions"
                      label="Género"
                      outlined
                      :rules="[
                        val => !!val || 'Por favor diligencie su genero',
                        val => !val || genderOptions.includes(val) || 'Seleccione una opción válida'
                      ]"
                    />
                  </div>
                </div>

                <div class="q-mt-lg flex justify-end">
                  <q-btn label="Cancelar" color="negative" flat v-close-popup class="q-mr-sm" />
                  <q-btn label="Guardar" type="submit" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Diálogo de edición de dirección -->
        <q-dialog v-model="addressEditDialog" persistent>
          <q-card style="min-width: 70vw;">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>Editar Dirección</q-toolbar-title>
              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section>
              <q-form @submit="saveAddressInfo">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      v-model="editForm.shippingAddress.street"
                      label="Dirección (Calle, número, apartamento)"
                      outlined
                      lazy-rules
                      :rules="[
                        val => !!val || 'La dirección es requerida',
                        val => val.length >= 5 || 'Mínimo 5 caracteres',
                        val => val.length <= 100 || 'Máximo 100 caracteres'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="editForm.shippingAddress.state"
                      :options="colombianStates"
                      label="Departamento"
                      outlined
                      use-input
                      @filter="filterStates"
                      :rules="[
                        val => !!val || 'El departamento es requerido',
                        val => allColombianStates.includes(val) || 'Seleccione un departamento válido'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="editForm.shippingAddress.city"
                      :options="filteredCities"
                      label="Ciudad"
                      outlined
                      use-input
                      @filter="filterCities"
                      :rules="[
                        val => !!val || 'La ciudad es requerida',
                        val => allColombianCities.includes(val) || 'Seleccione una ciudad válida'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.shippingAddress.zipCode"
                      label="Código Postal"
                      outlined
                      mask="######"
                      unmasked-value
                      hint="Código postal de 6 dígitos"
                      :rules="[
                        val => !!val || 'Por favor ingrese su código postal',
                        val => !val || val.length === 6 || 'Deben ser 6 dígitos',
                        val => !val || /^[0-9]+$/.test(val) || 'Solo números permitidos'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.shippingAddress.country"
                      label="País"
                      outlined
                      readonly
                      value="Colombia"
                    />
                  </div>
                </div>

                <div class="q-mt-lg flex justify-end">
                  <q-btn label="Cancelar" color="negative" flat v-close-popup class="q-mr-sm" />
                  <q-btn label="Guardar" type="submit" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
        <!-- Diálogo maximizado para ver factura -->
<q-dialog v-model="invoiceDialog" maximized transition-show="slide-up" transition-hide="slide-down">
  <q-card class="full-height">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>
        Factura #{{ selectedMovement?.paypalData ? selectedMovement.paypalData.id : selectedMovement?._id }}
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="scroll invoice-container">
      <div v-if="selectedMovement" class="invoice-content">
        <!-- Encabezado de la factura -->
        <div class="row justify-between items-center q-mb-lg">
          <div>
            <div class="text-h6">Tienda Online</div>
            <div class="text-caption">NIT: 123456789-0</div>
            <div class="text-caption">Dirección: Calle Falsa 123</div>
          </div>
          <div class="text-right">
            <div class="text-subtitle1">Fecha: {{ formatDate(selectedMovement.createdAt) }}</div>
            <div class="text-subtitle1">Estado: 
              <q-badge :color="getStatusColor(selectedMovement.status)">
                {{ getStatusText(selectedMovement.status) }}
              </q-badge>
            </div>
          </div>
        </div>

        <!-- Información del cliente -->
        <div class="row q-mb-lg">
          <div class="col">
            <div class="text-subtitle1 q-mb-sm">Cliente:</div>
            <div>{{ fullName }}</div>
            <div>{{ user.email }}</div>
            <div v-if="user.phone !== 'N/A'">{{ user.phone }}</div>
          </div>
          <div class="col">
            <div class="text-subtitle1 q-mb-sm">Dirección de envío:</div>
            <div>{{ user.shippingAddress.street }}</div>
            <div>{{ user.shippingAddress.city }}, {{ user.shippingAddress.state }}</div>
            <div>{{ user.shippingAddress.country }} - {{ user.shippingAddress.zipCode }}</div>
          </div>
        </div>

        <!-- Tabla de productos -->
        <q-table
          :rows="selectedMovement.products"
          :columns="invoiceColumns"
          row-key="name"
          hide-pagination
          flat
          bordered
          class="q-mb-lg"
        >
          <template v-slot:body-cell-price="props">
            <q-td :props="props">
              {{ formatCurrency(props.row.price) }}
            </q-td>
          </template>

          <template v-slot:body-cell-total="props">
            <q-td :props="props">
              {{ formatCurrency(props.row.total) }}
            </q-td>
          </template>
        </q-table>

        <!-- Resumen del pedido -->
        <div class="row justify-end">
          <div class="col-12 col-md-6">
            <q-list bordered class="rounded-borders">
              <q-item>
                <q-item-section>
                  <q-item-label>Subtotal</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ formatCurrency(selectedMovement.subtotal) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="selectedMovement.discount > 0">
                <q-item-section>
                  <q-item-label>Descuento</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-negative">-{{ formatCurrency(selectedMovement.discount) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Envío</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ formatCurrency(selectedMovement.shipping || 0) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label class="text-weight-bold">Total</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-weight-bold text-h6">
                    {{ formatCurrency(selectedMovement.total) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <!-- Información de pago -->
        <div class="row q-mt-lg" v-if="selectedMovement.paypalData">
          <div class="col-12">
            <div class="text-subtitle1 q-mb-sm">Información de pago:</div>
            <div class="row">
              <div class="col-12 col-md-6">
                <div><strong>Método:</strong> PayPal</div>
                <div><strong>ID de transacción:</strong> {{ selectedMovement.paypalData.id }}</div>
              </div>
              <div class="col-12 col-md-6">
                <div><strong>Estado:</strong> {{ selectedMovement.paypalData.status }}</div>
                <div><strong>Fecha de pago:</strong> {{ formatDate(selectedMovement.paypalData.create_time) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="bg-grey-2">
      <q-btn label="Descargar" :loading="loadingDownloadInvoice" icon="print" color="primary" @click="downloadInvoice(selectedMovement)" />
      <q-btn label="Imprimir" icon="print" color="primary" @click="printInvoice" />
      <q-btn label="Cerrar" color="primary" flat v-close-popup />

    </q-card-actions>
  </q-card>
</q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Loading, useQuasar } from 'quasar';
import { useStore } from '../stores/store.js';
import { DownloadInvoicePdf, getData, postData, putData } from '../service/service';
import { showNotification } from '../utils/utils';
const store = useStore();
const $q = useQuasar();

const loadingDownloadInvoice = ref(false);  //estoy añadiendo loading a la funcion de descarga de pdf
const invoiceDialog = ref(false);
const selectedMovement = ref(null);

// Imprimir factura 
const printInvoice = () => {
  window.print();
};

// Función para ver factura en diálogo maximizado
const seeInvoice = (movement) => {
  selectedMovement.value = movement;
  invoiceDialog.value = true;
};

const invoiceColumns = [
  {
    name: 'name',
    required: true,
    label: 'Producto',
    align: 'left',
    field: row => row.name,
    sortable: true
  },
  {
    name: 'price',
    label: 'Precio Unitario',
    align: 'right',
    field: row => row.price
  },
  {
    name: 'quantity',
    label: 'Cantidad',
    align: 'center',
    field: row => row.quantity
  },
  {
    name: 'discount',
    label: 'Descuento',
    align: 'right',
    field: row => row.discountPercentage ? `${row.discountPercentage}%` : '0%'
  },
  {
    name: 'total',
    label: 'Total',
    align: 'right',
    field: row => row.total
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'positive';
    case 'pending': return 'warning';
    case 'refunded': return 'info';
    case 'failed': return 'negative';
    default: return 'grey';
  }
}; 

// Datos del usuario
const user = ref(store.userInformation);
// Estado del drawer
const leftDrawerOpen = ref(true);
const miniState = ref(true);
const activeTab = ref('profile');
//movimientos 
const movements = ref([]);

const allColombianStates = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 
  'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 
  'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 
  'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 
  'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];

const allColombianCities = [
  // Ciudades principales por departamento
  // Amazonas
  'Leticia', 'Puerto Nariño',
  // Antioquia
  'Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro',
  // Atlántico
  'Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga',
  // Bogotá (especial)
  'Bogotá D.C.',
  // Bolívar
  'Cartagena', 'Magangué', 'Turbaco',
  // Boyacá
  'Tunja', 'Duitama', 'Sogamoso',
  // Caldas
  'Manizales', 'La Dorada', 'Chinchiná',
  // Valle del Cauca
  'Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago'
];

const colombianStates = ref([...allColombianStates]);
const filteredCities = ref([...allColombianCities]);

// Estado de los diálogos de edición
const personalEditDialog = ref(false);
const addressEditDialog = ref(false);

// Formulario de edición
const editForm = ref({
  name: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: null,
  gender: '',
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia'
  }
});

// Opciones para el selector de género
const genderOptions = [
  'Masculino', 'Femenino', 'Otro', 'Prefiero no decir'
];

onMounted(()=>{
  dataMovements()
})

// Computed properties
const fullName = computed(() => {
  return `${user.value.name} ${user.value.lastName !== 'No especificado' ? user.value.lastName : ''}`.trim();
});

const roleName = computed(() => {
  const roles = {
    1: "Usuario Estándar",
    2: "Administrador",
    3: "Moderador"
  };
  return roles[user.value.role] || "Usuario";
});

const roleBadgeColor = computed(() => {
  const colors = {
    1: "blue",
    2: "red",
    3: "orange"
  };
  return colors[user.value.role] || "blue";
});

// Métodos
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Filtrar departamentos
const filterStates = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    colombianStates.value = allColombianStates.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

// Filtrar ciudades basado en departamento seleccionado
const filterCities = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    if (editForm.value.shippingAddress.state) {
      // En un caso real, aquí deberías filtrar las ciudades del departamento seleccionado
      filteredCities.value = allColombianCities.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      );
    } else {
      filteredCities.value = allColombianCities.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

// Validación de fecha
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const isAdult = (dateString) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18;
};

const isTooOld = (dateString) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  return age > 120;
};

const openPersonalEditDialog = () => {
  // Copiar los datos actuales del usuario al formulario de edición
  editForm.value = {
    name: user.value.name,
    lastName: user.value.lastName,
    email: user.value.email,
    phone: user.value.phone !== 'N/A' ? user.value.phone : '',
    dateOfBirth: user.value.dateOfBirth ? formatDateForInput(user.value.dateOfBirth) : null,
    gender: user.value.gender !== 'No especificado' ? user.value.gender : '',
    shippingAddress: {
      street: user.value.shippingAddress.street,
      city: user.value.shippingAddress.city,
      state: user.value.shippingAddress.state,
      zipCode: user.value.shippingAddress.zipCode,
      country: user.value.shippingAddress.country
    }
  };
  
  personalEditDialog.value = true;
};

const openAddressEditDialog = () => {
  // Copiar los datos actuales de dirección al formulario de edición
  editForm.value.shippingAddress = {
    street: user.value.shippingAddress.street !== 'No especificado' ? user.value.shippingAddress.street : '',
    city: user.value.shippingAddress.city !== 'No especificada' ? user.value.shippingAddress.city : '',
    state: user.value.shippingAddress.state !== 'No especificado' ? user.value.shippingAddress.state : '',
    zipCode: user.value.shippingAddress.zipCode !== 'N/A' ? user.value.shippingAddress.zipCode : '',
    country: 'Colombia'
  };
  
  addressEditDialog.value = true;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const savePersonalInfo =async () => {
  // Actualizar los datos del usuario
  user.value.name = editForm.value.name;
  user.value.lastName = editForm.value.lastName || 'No especificado';
  user.value.email = editForm.value.email;
  user.value.phone = editForm.value.phone || 'N/A';
  user.value.dateOfBirth = editForm.value.dateOfBirth || null;
  user.value.gender = editForm.value.gender || 'No especificado';
  user.value.updatedAt = new Date().toISOString();
  
  const response = await putData(`/users/${user.value._id}`,{
      data:editForm.value
    })
  $q.notify({
    type: 'positive',
    message: 'Datos personales actualizados correctamente',
    position: 'top'
  });
  personalEditDialog.value = false;
};

const saveAddressInfo = () => {
  // Actualizar la dirección del usuario
  user.value.shippingAddress.street = editForm.value.shippingAddress.street || 'No especificado';
  user.value.shippingAddress.city = editForm.value.shippingAddress.city || 'No especificada';
  user.value.shippingAddress.state = editForm.value.shippingAddress.state || 'No especificado';
  user.value.shippingAddress.zipCode = editForm.value.shippingAddress.zipCode || 'N/A';
  user.value.shippingAddress.country = 'Colombia';
  
  // Actualizar la fecha de modificación
  user.value.updatedAt = new Date().toISOString();
  
  // Mostrar notificación de éxito
  $q.notify({
    type: 'positive',
    message: 'Dirección actualizada correctamente',
    position: 'top'
  });
  
  // Cerrar el diálogo
  addressEditDialog.value = false;
};

//movements
async function dataMovements(){
  try {
    const response = await getData(`/orders/${store.userId}`)
    movements.value = response.data
  } catch (error) {
    showNotification('negative','Error cargando movimientos')
    console.log('error en movimientos', error);
  }
}

async function downloadInvoice(dataInvoice){
  try {
    console.log("datos de factura", dataInvoice);
    loadingDownloadInvoice.value = true
    const response = await DownloadInvoicePdf('/invoice',{
      data:dataInvoice
    })

    const blob = response.data;
    console.log("Blob recibido:");
    console.log("Tipo (MIME Type):", blob.type);
    console.log("Tamaño (en bytes):", blob.size);
    let filename = `factura-ColproMarket-${dataInvoice._id ? dataInvoice._id.substring(0, 8) : 'anon'}.pdf`; // Nombre por defecto más robusto
    const contentDisposition = response.headers['content-disposition'];

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    const url = window.URL.createObjectURL(blob); 
    const a = document.createElement('a');     
    a.style.display = 'none';
    a.href = url;                             
    a.download = filename;                      
    document.body.appendChild(a);
    a.click();                                   
    document.body.removeChild(a);                
    window.URL.revokeObjectURL(url);             

    showNotification('positive', 'Factura descargada con éxito.');
    console.log('Factura descargada con éxito!');

  } catch (error) {
    console.error('Error al descargar la factura:', error); 
    
    if (error.response && error.response.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = function() {
        try {
          const errorJson = JSON.parse(reader.result);
          showNotification('negative', errorJson.message || 'Error desconocido del servidor.');
          console.error('Mensaje de error del servidor:', errorJson);
        } catch (parseError) {
          showNotification('negative', 'Ocurrió un error inesperado al procesar la respuesta del servidor.');
          console.error('Error al parsear el mensaje de error del servidor:', parseError);
        }
      };
      reader.readAsText(error.response.data); 
    } else if (error.request) {
      showNotification('negative', 'No se pudo conectar con el servidor. Revisa tu conexión a internet.');
    } else {
      showNotification('negative', 'Ocurrió un error al intentar generar la factura.');
    }
  } finally{
    loadingDownloadInvoice.value = false;
  }
}

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    // Intenta convertir si es un string que parezca un número
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 'N/A';
    amount = numAmount;
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusText = (status) => {
  switch (status) {
    case 'paid': return 'Pagado';
    case 'pending': return 'Pendiente';
    case 'refunded': return 'Reembolsado';
    case 'failed': return 'Fallido';
    default: return 'Desconocido';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'paid': return 'check_circle';
    case 'pending': return 'hourglass_empty';
    case 'refunded': return 'undo';
    case 'failed': return 'error';
    default: return 'help_outline';
  }
};
</script>

<style lang="scss" scoped>
.profile-page {
  background-color: #f5f7fa;
}

.profile-header {
  position: relative;
  z-index: 1;
  
  .header-overlay {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    padding: 20px;
    border-radius: 8px;
  }
}

.profile-content, .movements-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.invoice-container {
  height: calc(100% - 50px);
  padding: 20px;
}

.invoice-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: white;
}

@media print {
  body * {
    visibility: hidden;
  }
  .invoice-content, .invoice-content * {
    visibility: visible;
  }
  .invoice-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
  }
  .q-toolbar, .q-card__actions {
    display: none;
  }
}

.my-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .q-card-section {
    &:first-child {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
  }
}

.q-drawer {
  background-color: #f5f5f5;
  transition: width 0.3s ease;
  
  .q-item {
    border-radius: 8px;
    margin: 4px 8px;
    transition: background-color 0.3s ease;
    
    &--active {
      background-color: #e0e0e0;
      color: #1976d2;
      font-weight: 500;
      
      .q-icon {
        color: #1976d2;
      }
    }
    
    &:hover:not(.q-item--active) {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}

.q-page-container {
  padding-left: 300px;
  transition: padding-left 0.3s ease;
  
  @media (max-width: 700px) {
    padding-left: 0;
  }
}

.q-drawer--mini {
  width: 60px !important;
  
  .q-item__section--avatar {
    min-width: 0;
  }
  
  .q-item__section--main {
    display: none;
  }
}

.movements-viewer-page {
  .movement-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .movement-header {
      padding: 16px;
      background-color: #f9f9f9;
    }
    
    .movement-details {
      padding: 16px;
    }
    
    .product-item {
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }
  }
  
  .status-paid {
    color: $positive;
  }
  
  .status-pending {
    color: $warning;
  }
  
  .status-refunded {
    color: $info;
  }
  
  .status-failed {
    color: $negative;
  }
  
  .total-amount {
    color: $primary;
  }
  
  .empty-state {
    padding: 40px;
    border-radius: 12px;
    background-color: #f9f9f9;
    
    .q-icon {
      opacity: 0.7;
    }
  }
}

.products-expansion {
  .q-item__section--main {
    flex: 1 1 auto;
  }
  
  .q-item__section--side {
    flex: 0 0 auto;
  }
}

.q-list--bordered {
  border-radius: 8px;
}

.q-item {
  padding: 12px 16px;
}

.q-item__label {
  font-size: 0.9rem;
}

.q-item__label--caption {
  font-size: 0.8rem;
  color: $grey-7;
}

.q-badge {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.q-parallax {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }
}

.q-page-sticky {
  z-index: 2000;
}

@media (max-width: 600px) {
  .profile-header {
    .header-overlay {
      flex-direction: column;
      text-align: center;
      
      .q-avatar {
        margin-right: 0;
        margin-bottom: 16px;
      }
    }
  }
  
  .movement-details {
    flex-direction: column;
    
    .text-right {
      text-align: left !important;
      margin-top: 12px;
    }
  }
}
</style>