from django.db import models


class Conductores(models.Model):
    id = models.TextField(primary_key=True)
    nombre = models.TextField()
    apellido = models.TextField()
    ci = models.TextField(unique=True)
    licencia = models.TextField()
    categoria = models.TextField()
    vencimiento_licencia = models.DateTimeField()
    telefono = models.TextField(blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField()
    actualizado_en = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'conductores'


class DispositivosGps(models.Model):
    id = models.TextField(primary_key=True)
    imei = models.TextField(unique=True)
    modelo = models.TextField(blank=True, null=True)
    fabricante = models.TextField(blank=True, null=True)
    numero_serie = models.TextField(blank=True, null=True)
    vehiculo = models.ForeignKey('Vehiculos', models.DO_NOTHING, blank=True, null=True)
    estado = models.TextField(blank=True, null=True)
    conectado = models.BooleanField(blank=True, null=True)
    ultima_senal = models.DateTimeField(blank=True, null=True)
    ultima_latitud = models.FloatField(blank=True, null=True)
    ultima_longitud = models.FloatField(blank=True, null=True)
    intervalo_reporte = models.FloatField(blank=True, null=True)
    alerta_velocidad = models.FloatField(blank=True, null=True)
    alerta_combustible = models.FloatField(blank=True, null=True)
    fecha_instalacion = models.DateTimeField(blank=True, null=True)
    fecha_activacion = models.DateTimeField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField()
    actualizado_en = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dispositivos_gps'


class DocumentosConductor(models.Model):
    id = models.TextField(primary_key=True)
    conductor = models.ForeignKey(Conductores, models.DO_NOTHING)
    tipo_documento = models.TextField()
    nombre_archivo = models.TextField()
    url_archivo = models.TextField()
    tipo_archivo = models.TextField()
    tamano_bytes = models.FloatField(blank=True, null=True)
    validado = models.BooleanField(blank=True, null=True)
    validado_por = models.ForeignKey('Users', models.DO_NOTHING, db_column='validado_por', blank=True, null=True)
    fecha_validacion = models.DateTimeField(blank=True, null=True)
    observaciones_validacion = models.TextField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_emision = models.DateTimeField(blank=True, null=True)
    fecha_vencimiento = models.DateTimeField(blank=True, null=True)
    subido_por = models.ForeignKey('Users', models.DO_NOTHING, db_column='subido_por', related_name='documentosconductor_subido_por_set', blank=True, null=True)
    creado_en = models.DateTimeField()
    actualizado_en = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'documentos_conductor'


class GpsTracking(models.Model):
    id = models.TextField(primary_key=True)
    vehiculo = models.ForeignKey('Vehiculos', models.DO_NOTHING)
    latitud = models.FloatField()
    longitud = models.FloatField()
    altitud = models.FloatField(blank=True, null=True)
    satelites = models.FloatField(blank=True, null=True)
    velocidad = models.FloatField(blank=True, null=True)
    direccion = models.FloatField(blank=True, null=True)
    estado_motor = models.TextField(blank=True, null=True)
    nivel_combustible = models.FloatField(blank=True, null=True)
    timestamp = models.DateTimeField()
    precision = models.FloatField(blank=True, null=True)
    proveedor = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'gps_tracking'


class Mantenimientos(models.Model):
    id = models.TextField(primary_key=True)
    vehiculo = models.ForeignKey('Vehiculos', models.DO_NOTHING)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField(blank=True, null=True)
    estado = models.TextField(blank=True, null=True)
    nombre_taller = models.TextField(blank=True, null=True)
    contacto_taller = models.TextField(blank=True, null=True)
    descripcion_problema = models.TextField(blank=True, null=True)
    trabajos_realizados = models.TextField(blank=True, null=True)
    partes_interiores = models.TextField(blank=True, null=True)
    partes_exteriores = models.TextField(blank=True, null=True)
    costo_total = models.FloatField(blank=True, null=True)
    moneda = models.TextField(blank=True, null=True)
    fichas_urls = models.TextField(blank=True, null=True)
    datos_ocr = models.TextField(blank=True, null=True)
    registrado_por = models.ForeignKey('Users', models.DO_NOTHING, db_column='registrado_por', blank=True, null=True)
    creado_en = models.DateTimeField()
    actualizado_en = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mantenimientos'


class Roles(models.Model):
    id = models.TextField(primary_key=True)
    name = models.TextField(unique=True)
    description = models.TextField(blank=True, null=True)
    permissions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roles'


class Rutas(models.Model):
    id = models.TextField(primary_key=True)
    nombre = models.TextField()
    vehiculo = models.ForeignKey('Vehiculos', models.DO_NOTHING, blank=True, null=True)
    origen = models.TextField()
    origen_lat = models.FloatField(blank=True, null=True)
    origen_lng = models.FloatField(blank=True, null=True)
    destino = models.TextField()
    destino_lat = models.FloatField(blank=True, null=True)
    destino_lng = models.FloatField(blank=True, null=True)
    distancia_km = models.FloatField(blank=True, null=True)
    duracion_minutos = models.FloatField(blank=True, null=True)
    fecha_salida = models.DateTimeField(blank=True, null=True)
    fecha_llegada_estimada = models.DateTimeField(blank=True, null=True)
    estado = models.TextField(blank=True, null=True)
    inicio_real = models.DateTimeField(blank=True, null=True)
    fin_real = models.DateTimeField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField()
    actualizado_en = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rutas'


class UserSessions(models.Model):
    id = models.TextField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    token = models.TextField()
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    active = models.BooleanField()
    user_agent = models.TextField(blank=True, null=True)
    ip = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_sessions'


class Users(models.Model):
    id = models.TextField(primary_key=True)
    email = models.TextField(unique=True)
    name = models.TextField()
    password = models.TextField()
    role = models.ForeignKey(Roles, models.DO_NOTHING, blank=True, null=True)
    profile_image = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    active = models.BooleanField()
    last_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'

    @property
    def is_authenticated(self):
        return True


class Vehiculos(models.Model):
    id = models.TextField(primary_key=True)
    placa = models.TextField(unique=True)
    marca = models.TextField()
    anio = models.FloatField(blank=True, null=True)
    tipo_vehiculo = models.TextField(blank=True, null=True)
    capacidad_litros = models.FloatField(blank=True, null=True)
    combustible = models.TextField(blank=True, null=True)
    chasis = models.TextField(blank=True, null=True)
    nro_soat = models.TextField(blank=True, null=True)
    venc_soat = models.DateTimeField(blank=True, null=True)
    nro_itv = models.TextField(blank=True, null=True)
    venc_itv = models.DateTimeField(blank=True, null=True)
    nro_permiso = models.TextField(blank=True, null=True)
    venc_permiso = models.DateTimeField(blank=True, null=True)
    gps_id = models.TextField(blank=True, null=True)
    gps_activo = models.BooleanField(blank=True, null=True)
    estado = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField()
    actualizado_en = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vehiculos'


class Viajes(models.Model):
    id = models.TextField(primary_key=True)
    vehiculo = models.ForeignKey(Vehiculos, models.DO_NOTHING)
    conductor = models.ForeignKey(Conductores, models.DO_NOTHING)
    ruta = models.ForeignKey(Rutas, models.DO_NOTHING, blank=True, null=True)
    numero_viaje = models.TextField(unique=True)
    numero_factura = models.TextField(blank=True, null=True)
    producto = models.TextField()
    cantidad = models.FloatField()
    unidad = models.TextField(blank=True, null=True)
    lugar_carga = models.TextField()
    lugar_descarga = models.TextField()
    lugar_carga_lat = models.FloatField(blank=True, null=True)
    lugar_carga_lng = models.FloatField(blank=True, null=True)
    lugar_descarga_lat = models.FloatField(blank=True, null=True)
    lugar_descarga_lng = models.FloatField(blank=True, null=True)
    fecha_inicio = models.DateTimeField()
    hora_inicio = models.TextField(blank=True, null=True)
    fecha_fin = models.DateTimeField(blank=True, null=True)
    hora_fin = models.TextField(blank=True, null=True)
    fecha_estimada_llegada = models.DateTimeField(blank=True, null=True)
    estado = models.TextField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    referencia = models.TextField(blank=True, null=True)
    codigo_qr = models.TextField(blank=True, null=True)
    url_hoja_ruta = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField()
    actualizado_en = models.DateTimeField(blank=True, null=True)
    creado_por = models.ForeignKey(Users, models.DO_NOTHING, db_column='creado_por', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'viajes'
