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