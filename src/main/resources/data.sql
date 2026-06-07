INSERT
IGNORE INTO pergunta_inspecao (pergunta, tipo_equipamento, ativo) VALUES
-- Extintor
('A pressão do manômetro está na faixa verde?', 'Extintor', true),
('O lacre de segurança está intacto?', 'Extintor', true),
('O pino de segurança está presente?', 'Extintor', true),
('O bico e mangueira estão desobstruídos?', 'Extintor', true),
('O corpo está sem amassados, ferrugem ou danos?', 'Extintor', true),
('A etiqueta de inspeção está visível e atualizada?', 'Extintor', true),
('O extintor está no local correto e sinalizado?', 'Extintor', true),
('O acesso ao extintor está desobstruído?', 'Extintor', true),
('O peso está dentro do limite aceitável?', 'Extintor', true),
('A validade da recarga está dentro do prazo?', 'Extintor', true),
-- Alarme
('O painel de controle está sem indicação de falha?', 'Alarme', true),
('O alarme sonoro disparou corretamente no teste?', 'Alarme', true),
('O alarme visual (strobo) está funcionando?', 'Alarme', true),
('O sensor está limpo e sem obstruções?', 'Alarme', true),
('A bateria de backup está carregada?', 'Alarme', true),
('A fiação está íntegra e sem danos visíveis?', 'Alarme', true),
('O detector está firmemente fixado no teto/parede?', 'Alarme', true),
('A central recebeu o sinal do detector no teste?', 'Alarme', true),
('O sistema foi resetado corretamente após o teste?', 'Alarme', true),
-- Hidrante
('A válvula de abertura está operacional?', 'Hidrante', true),
('A mangueira está sem vazamentos, rachaduras ou dobras?', 'Hidrante', true),
('O esguicho está em boas condições e sem entupimentos?', 'Hidrante', true),
('A pressão da água está dentro do limite aceitável?', 'Hidrante', true),
('O abrigo (caixa) está sem danos e fechando corretamente?', 'Hidrante', true),
('A sinalização do hidrante está visível?', 'Hidrante', true),
('O acesso ao hidrante está desobstruído?', 'Hidrante', true),
('A mangueira está corretamente acondicionada no abrigo?', 'Hidrante', true),
('O registro de recalque está acessível e identificado?', 'Hidrante', true);


INSERT
IGNORE INTO usuario (nome, email, cpf, senha, tipo_usuario)
VALUES (
    'root',
    'root@ispec.com',
    '000.000.000-00',
     '$2b$10$ZTvPllvsP/k6Sl0QFp3bsu4Xdi2YlqDyWjLO.wYFFxk9Jss9efq7i',
    'ADMIN'
);

INSERT
IGNORE INTO tipo_equipamento (desc_tipo) VALUES
                                             ('Extintor'), ('Hidrante'), ('Alarme');

INSERT
IGNORE INTO agente_extintor (desc_agente) VALUES
                                              ('Água'), ('Pó Químico'), ('CO2'), ('Espuma'), ('Acetato de Potássio');

INSERT
IGNORE INTO classe_fogo (desc_cl_fogo) VALUES
                                           ('A'), ('B'), ('C'), ('D'), ('K');

INSERT
IGNORE INTO tipo_sensor (desc_sensor) VALUES
                                          ('Fumaça'), ('Temperatura'), ('Movimento'), ('Chama');


-- ═══════════════════════════════════════════════════════
-- iSpec – data.sql (executado automaticamente ao subir)
-- ═══════════════════════════════════════════════════════

-- ── Perguntas de inspeção ─────────────────────────────────
INSERT IGNORE INTO pergunta_inspecao (pergunta, tipo_equipamento, ativo) VALUES
('A pressão do manômetro está na faixa verde?', 'Extintor', true),
('O lacre de segurança está intacto?', 'Extintor', true),
('O pino de segurança está presente?', 'Extintor', true),
('O bico e mangueira estão desobstruídos?', 'Extintor', true),
('O corpo está sem amassados, ferrugem ou danos?', 'Extintor', true),
('A etiqueta de inspeção está visível e atualizada?', 'Extintor', true),
('O extintor está no local correto e sinalizado?', 'Extintor', true),
('O acesso ao extintor está desobstruído?', 'Extintor', true),
('O peso está dentro do limite aceitável?', 'Extintor', true),
('A validade da recarga está dentro do prazo?', 'Extintor', true),
('O painel de controle está sem indicação de falha?', 'Alarme', true),
('O alarme sonoro disparou corretamente no teste?', 'Alarme', true),
('O alarme visual (strobo) está funcionando?', 'Alarme', true),
('O sensor está limpo e sem obstruções?', 'Alarme', true),
('A bateria de backup está carregada?', 'Alarme', true),
('A fiação está íntegra e sem danos visíveis?', 'Alarme', true),
('O detector está firmemente fixado no teto/parede?', 'Alarme', true),
('A central recebeu o sinal do detector no teste?', 'Alarme', true),
('O sistema foi resetado corretamente após o teste?', 'Alarme', true),
('A válvula de abertura está operacional?', 'Hidrante', true),
('A mangueira está sem vazamentos, rachaduras ou dobras?', 'Hidrante', true),
('O esguicho está em boas condições e sem entupimentos?', 'Hidrante', true),
('A pressão da água está dentro do limite aceitável?', 'Hidrante', true),
('O abrigo (caixa) está sem danos e fechando corretamente?', 'Hidrante', true),
('A sinalização do hidrante está visível?', 'Hidrante', true),
('O acesso ao hidrante está desobstruído?', 'Hidrante', true),
('A mangueira está corretamente acondicionada no abrigo?', 'Hidrante', true),
('O registro de recalque está acessível e identificado?', 'Hidrante', true);

-- ── Usuários (senha: Teste@123) ───────────────────────────
INSERT IGNORE INTO usuario (nome, cpf, email, tipo_usuario, senha) VALUES
('Carlos Admin',    '111.111.111-11', 'carlos@ispec.com',   'ADMIN',   '$2a$10$X9v8Kz2mN5pQ7rL4wS6tHuYeWqA3bF1gH0iM9nP2sT4uV7wX3yZ6c'),
('Ana Fiscal',      '222.222.222-22', 'ana@ispec.com',      'FISCAL',  '$2a$10$X9v8Kz2mN5pQ7rL4wS6tHuYeWqA3bF1gH0iM9nP2sT4uV7wX3yZ6c'),
('Bruno Fiscal',    '333.333.333-33', 'bruno@ispec.com',    'FISCAL',  '$2a$10$X9v8Kz2mN5pQ7rL4wS6tHuYeWqA3bF1gH0iM9nP2sT4uV7wX3yZ6c'),
('Diego Tecnico',   '444.444.444-44', 'diego@ispec.com',    'TECNICO', '$2a$10$X9v8Kz2mN5pQ7rL4wS6tHuYeWqA3bF1gH0iM9nP2sT4uV7wX3yZ6c'),
('Eduarda Tecnica', '555.555.555-55', 'eduarda@ispec.com',  'TECNICO', '$2a$10$X9v8Kz2mN5pQ7rL4wS6tHuYeWqA3bF1gH0iM9nP2sT4uV7wX3yZ6c'),
('Fernanda Fiscal', '666.666.666-66', 'fernanda@ispec.com', 'FISCAL',  '$2a$10$X9v8Kz2mN5pQ7rL4wS6tHuYeWqA3bF1gH0iM9nP2sT4uV7wX3yZ6c'),
('Gabriel Tecnico', '777.777.777-77', 'gabriel@ispec.com',  'TECNICO', '$2a$10$X9v8Kz2mN5pQ7rL4wS6tHuYeWqA3bF1gH0iM9nP2sT4uV7wX3yZ6c'),
('Helena Admin',    '888.888.888-88', 'helena@ispec.com',   'ADMIN',   '$2a$10$X9v8Kz2mN5pQ7rL4wS6tHuYeWqA3bF1gH0iM9nP2sT4uV7wX3yZ6c');

-- ── Clientes ─────────────────────────────────────────────
INSERT IGNORE INTO cliente (razao_social, cnpj, email, telefone, responsavel, cidade, uf, endereco, status_cliente, observacoes) VALUES
('Condominio Parque das Flores',   '11.111.111/0001-11', 'contato@parquedasflores.com.br',  '(11) 3333-1111', 'Joao Silva',     'Sao Paulo',    'SP', 'Rua das Flores, 100',       'ativo',    'Cliente desde 2022'),
('Shopping Center Norte',          '22.222.222/0001-22', 'manutencao@centernorte.com.br',   '(11) 3333-2222', 'Maria Souza',    'Sao Paulo',    'SP', 'Av. Zaki Narchi, 200',      'ativo',    'Contrato anual renovado'),
('Hospital Sao Lucas',             '33.333.333/0001-33', 'seguranca@saolucas.com.br',       '(11) 3333-3333', 'Dr. Pedro Lima', 'Sao Paulo',    'SP', 'Rua da Saude, 300',         'ativo',    'Prioridade maxima'),
('Escola Municipal Prof. Claudio', '44.444.444/0001-44', 'admin@escolaclaudio.sp.gov.br',   '(11) 3333-4444', 'Ana Pereira',    'Guarulhos',    'SP', 'Av. Principal, 400',        'ativo',    'Inspecao semestral'),
('Industria Metalurgica Ferreira', '55.555.555/0001-55', 'contato@metalurgicaferreira.com', '(11) 3333-5555', 'Roberto Costa',  'Santo Andre',  'SP', 'Rua Industrial, 500',       'ativo',    'Alto risco de incendio'),
('Galpao Logistico FastLog',       '66.666.666/0001-66', 'ti@fastlog.com.br',               '(11) 3333-6666', 'Carlos Rocha',   'Osasco',       'SP', 'Rodovia Anhanguera, 600',   'pendente', 'Aguardando documentacao'),
('Clinica Odontologica Sorrir',    '77.777.777/0001-77', 'contato@clinicasorrir.com.br',    '(11) 3333-7777', 'Dra. Lucia Melo','Campinas',     'SP', 'Rua do Sorriso, 700',       'ativo',    'Novo cliente'),
('Edificio Comercial Torres Sul',  '88.888.888/0001-88', 'adm@torressul.com.br',            '(11) 3333-8888', 'Paulo Mendes',   'Sao Bernardo', 'SP', 'Av. Empresarial, 800',      'inativo',  'Contrato encerrado');

-- ── Tipos de equipamento ──────────────────────────────────
INSERT IGNORE INTO tipo_equipamento (desc_tipo) VALUES
('Extintor CO2'),
('Extintor Po ABC'),
('Extintor Agua'),
('Alarme de Fumaca'),
('Alarme de Temperatura'),
('Hidrante de Parede'),
('Hidrante de Coluna');

-- ── Agentes extintores ────────────────────────────────────
INSERT IGNORE INTO agente_extintor (desc_agente) VALUES
('CO2'),
('Po Quimico ABC'),
('Agua Pressurizada'),
('Espuma Mecanica');

-- ── Tipos de sensor ───────────────────────────────────────
INSERT IGNORE INTO tipo_sensor (desc_sensor) VALUES
('Fumaca Ionico'),
('Fumaca Optico'),
('Temperatura'),
('Chama');

-- ── Localizações ──────────────────────────────────────────
INSERT IGNORE INTO localizacao (id_cliente, bloco, andar, sala) VALUES
(1, 'Bloco A', 'Terreo',   'Hall de Entrada'),
(1, 'Bloco A', '1 Andar',  'Corredor Principal'),
(1, 'Bloco B', 'Terreo',   'Garagem'),
(1, 'Bloco B', '2 Andar',  'Salao de Festas'),
(2, 'Ala A',   'Terreo',   'Praca de Alimentacao'),
(2, 'Ala B',   '1 Andar',  'Lojas'),
(2, 'Ala C',   'Subsolo',  'Estacionamento'),
(3, 'Predio Principal', 'Terreo',   'Recepcao'),
(3, 'Predio Principal', '2 Andar',  'UTI'),
(3, 'Anexo',            'Terreo',   'Farmacia'),
(4, 'Bloco Pedagogico', 'Terreo',   'Secretaria'),
(4, 'Bloco Pedagogico', '1 Andar',  'Biblioteca'),
(5, 'Galpao 1', 'Terreo', 'Producao'),
(5, 'Galpao 2', 'Terreo', 'Almoxarifado');

-- ── Equipamentos ─────────────────────────────────────────
INSERT IGNORE INTO equipamento (dtype, nome, num_serie, id_cliente, id_localizacao, id_tipo_equip, dt_instalacao, dt_validade, status, status_manual, capacidade, pressao, id_agente) VALUES
('Extintor', 'Extintor CO2 Hall A',        'EXT-001', 1, 1,  1, '2023-01-10', '2026-01-10', 'ATIVO',   false, 6.0,  14.0, 1),
('Extintor', 'Extintor Po Corredor A',     'EXT-002', 1, 2,  2, '2023-02-15', '2024-02-15', 'VENCIDO', false, 6.0,  12.0, 2),
('Extintor', 'Extintor CO2 Garagem',       'EXT-003', 1, 3,  1, '2024-01-20', '2027-01-20', 'ATIVO',   false, 9.0,  14.0, 1),
('Extintor', 'Extintor Po Salao',          'EXT-004', 1, 4,  2, '2024-03-01', '2026-06-01', 'ATIVO',   false, 4.0,  13.0, 2),
('Extintor', 'Extintor Praca Alimentacao', 'EXT-005', 2, 5,  2, '2023-06-01', '2026-06-01', 'ATIVO',   false, 6.0,  14.0, 2),
('Extintor', 'Extintor Lojas Ala B',       'EXT-006', 2, 6,  1, '2024-01-15', '2027-01-15', 'ATIVO',   false, 6.0,  14.0, 1),
('Extintor', 'Extintor Estacionamento',    'EXT-007', 2, 7,  2, '2022-05-10', '2025-05-10', 'VENCIDO', false, 9.0,  11.0, 2),
('Extintor', 'Extintor Recepcao Hospital', 'EXT-008', 3, 8,  1, '2024-02-01', '2027-02-01', 'ATIVO',   false, 6.0,  14.0, 1),
('Extintor', 'Extintor UTI',               'EXT-009', 3, 9,  1, '2024-02-01', '2026-08-01', 'ATIVO',   false, 6.0,  14.0, 1),
('Extintor', 'Extintor Farmacia',          'EXT-010', 3, 10, 2, '2023-08-15', '2026-08-15', 'ATIVO',   false, 4.0,  13.0, 2),
('Extintor', 'Extintor Secretaria',        'EXT-011', 4, 11, 2, '2024-01-10', '2027-01-10', 'ATIVO',   false, 6.0,  14.0, 2),
('Extintor', 'Extintor Biblioteca',        'EXT-012', 4, 12, 1, '2023-11-20', '2026-11-20', 'ATIVO',   false, 4.0,  14.0, 1),
('Extintor', 'Extintor Galpao Producao',   'EXT-013', 5, 13, 2, '2023-03-01', '2026-03-01', 'ATIVO',   false, 12.0, 13.0, 2),
('Extintor', 'Extintor Almoxarifado',      'EXT-014', 5, 14, 2, '2024-04-01', '2026-10-01', 'ATIVO',   false, 9.0,  14.0, 2);

INSERT IGNORE INTO equipamento (dtype, nome, num_serie, id_cliente, id_localizacao, id_tipo_equip, dt_instalacao, dt_validade, status, status_manual, funcionando, ultima_verificacao, id_tipo_sensor) VALUES
('Alarme', 'Alarme Fumaca Hall A',     'ALR-001', 1, 1,  4, '2023-01-10', '2026-01-10', 'ATIVO', false, true,  '2024-01-10', 1),
('Alarme', 'Alarme Fumaca Corredor',   'ALR-002', 1, 2,  4, '2023-06-15', '2026-06-15', 'ATIVO', false, true,  '2024-06-15', 2),
('Alarme', 'Alarme Temp Garagem',      'ALR-003', 1, 3,  5, '2024-01-20', '2027-01-20', 'ATIVO', false, false, '2023-12-01', 3),
('Alarme', 'Alarme Praca Alimentacao', 'ALR-004', 2, 5,  4, '2023-06-01', '2026-06-01', 'ATIVO', false, true,  '2024-06-01', 1),
('Alarme', 'Alarme UTI Hospital',      'ALR-005', 3, 9,  4, '2024-02-01', '2027-02-01', 'ATIVO', false, true,  '2025-02-01', 2),
('Alarme', 'Alarme Galpao Producao',   'ALR-006', 5, 13, 5, '2023-03-01', '2026-03-01', 'ATIVO', false, true,  '2024-03-01', 3);

INSERT IGNORE INTO equipamento (dtype, nome, num_serie, id_cliente, id_localizacao, id_tipo_equip, dt_instalacao, dt_validade, status, status_manual, pressao_agua, comprimento_mangueira) VALUES
('Hidrante', 'Hidrante Garagem Bloco A',   'HID-001', 1, 3,  6, '2023-01-10', '2026-01-10', 'ATIVO', false, 8.0, 25.0),
('Hidrante', 'Hidrante Salao de Festas',   'HID-002', 1, 4,  6, '2023-06-15', '2026-06-15', 'ATIVO', false, 7.5, 20.0),
('Hidrante', 'Hidrante Estacionamento',    'HID-003', 2, 7,  7, '2022-05-10', '2025-05-10', 'ATIVO', false, 6.0, 30.0),
('Hidrante', 'Hidrante Corredor Hospital', 'HID-004', 3, 8,  6, '2024-02-01', '2027-02-01', 'ATIVO', false, 8.5, 25.0),
('Hidrante', 'Hidrante Galpao 1',          'HID-005', 5, 13, 7, '2023-03-01', '2026-03-01', 'ATIVO', false, 7.0, 30.0),
('Hidrante', 'Hidrante Galpao 2',          'HID-006', 5, 14, 6, '2024-04-01', '2027-04-01', 'ATIVO', false, 8.0, 25.0);

-- ── Inspeções aprovadas ───────────────────────────────────
INSERT IGNORE INTO inspecao (id_equipamento, id_responsavel, data_inspecao, aprovado, observacoes) VALUES
(1,  2, '2026-05-10', true,  'Tudo em conformidade.'),
(3,  3, '2026-05-12', true,  'Pressao adequada, lacre intacto.'),
(5,  2, '2026-05-14', true,  'Extintor em perfeito estado.'),
(8,  6, '2026-05-15', true,  'Inspecao hospitalar aprovada.'),
(9,  6, '2026-05-15', true,  'UTI com todos os extintores conformes.'),
(11, 3, '2026-05-18', true,  'Escola em conformidade.'),
(13, 4, '2026-05-20', true,  'Galpao aprovado.'),
(15, 2, '2026-05-22', true,  'Alarme funcionando corretamente.'),
(19, 6, '2026-05-25', true,  'Hidrante com pressao adequada.'),
(21, 3, '2026-05-28', true,  'Hospital aprovado.');

-- ── Inspeções reprovadas ──────────────────────────────────
INSERT IGNORE INTO inspecao (id_equipamento, id_responsavel, data_inspecao, aprovado, observacoes) VALUES
(2,  2, '2026-05-11', false, 'Extintor com pressao baixa, lacre rompido.'),
(7,  3, '2026-05-13', false, 'Extintor vencido ha mais de 6 meses.'),
(17, 4, '2026-05-16', false, 'Alarme de temperatura com sensor defeituoso.'),
(18, 2, '2026-05-19', false, 'Alarme nao disparou no teste.'),
(20, 6, '2026-05-23', false, 'Hidrante com mangueira danificada.');

-- ── Agendamentos ─────────────────────────────────────────
INSERT IGNORE INTO agendamento (id_responsavel, data, tipo, status, titulo, descricao) VALUES
(2, DATE_ADD(CURDATE(), INTERVAL 1  DAY), 'INSPECAO',       'PENDENTE', 'Inspecao Condominio Parque das Flores', 'Inspecao semestral completa'),
(3, DATE_ADD(CURDATE(), INTERVAL 2  DAY), 'INSPECAO',       'PENDENTE', 'Inspecao Shopping Center Norte',        'Verificacao dos extintores da Ala C'),
(4, DATE_ADD(CURDATE(), INTERVAL 3  DAY), 'MANUTENCAO',     'PENDENTE', 'Manutencao Hospital Sao Lucas',         'Troca de carga extintor UTI'),
(6, DATE_ADD(CURDATE(), INTERVAL 4  DAY), 'VISITA_TECNICA', 'PENDENTE', 'Visita Tecnica Metalurgica Ferreira',   'Avaliacao de novos equipamentos'),
(2, DATE_ADD(CURDATE(), INTERVAL 5  DAY), 'INSPECAO',       'PENDENTE', 'Inspecao Escola Municipal',             'Inspecao anual obrigatoria'),
(3, DATE_ADD(CURDATE(), INTERVAL 6  DAY), 'MANUTENCAO',     'PENDENTE', 'Manutencao FastLog',                    'Revisao hidrantes galpao'),
(4, DATE_ADD(CURDATE(), INTERVAL 7  DAY), 'VISITA_TECNICA', 'PENDENTE', 'Visita Clinica Sorrir',                 'Primeiro contato novo cliente'),
(2, DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'INSPECAO',       'PENDENTE', 'Inspecao Torres Sul',                   'Inspecao trimestral'),
(6, DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'INSPECAO',       'PENDENTE', 'Inspecao Shopping - Ala A',             'Verificacao alarmes'),
(3, DATE_ADD(CURDATE(), INTERVAL -5 DAY), 'INSPECAO',       'PENDENTE', 'Inspecao Condominio Bloco B',           'Vencida - aguardando confirmacao');