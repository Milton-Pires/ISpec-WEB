package br.com.ispec.Service;

import br.com.ispec.DTO.InspecaoDTO;
import br.com.ispec.Entities.*;
import br.com.ispec.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InspecaoService {

    private final InspecaoRepository repository;
    private final EquipamentoRepository equipamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerguntaInspecaoRepository perguntaRepository;
    private final ItemInspecaoRepository itemRepository;

    public InspecaoService(InspecaoRepository repository,
                           EquipamentoRepository equipamentoRepository,
                           UsuarioRepository usuarioRepository,
                           PerguntaInspecaoRepository perguntaRepository,
                           ItemInspecaoRepository itemRepository) {
        this.repository = repository;
        this.equipamentoRepository = equipamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.perguntaRepository = perguntaRepository;
        this.itemRepository = itemRepository;
    }

    public List<Inspecao> listarTodas() {
        return repository.findAll();
    }

    public Inspecao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspeção não encontrada: " + id));
    }

    public List<Inspecao> listarPorEquipamento(Long equipamentoId) {
        return repository.findByEquipamento_Id(equipamentoId);
    }

    public List<ItemInspecao> listarItensPorInspecao(Long inspecaoId) {
        Inspecao inspecao = buscarPorId(inspecaoId);
        return itemRepository.findByInspecao(inspecao);
    }

    @Transactional
    public Inspecao salvar(Inspecao inspecao, String emailResponsavel) {
        if (inspecao.getResponsavel() == null || inspecao.getResponsavel().getId() == null) {
            Usuario usuario = usuarioRepository.findByEmail(emailResponsavel)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            inspecao.setResponsavel(usuario);
        } else {
            Usuario usuario = usuarioRepository.findById(inspecao.getResponsavel().getId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            inspecao.setResponsavel(usuario);
        }

        if (inspecao.getEquipamento() != null && inspecao.getEquipamento().getId() != null) {
            Equipamento eq = equipamentoRepository.findById(inspecao.getEquipamento().getId())
                    .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
            inspecao.setEquipamento(eq);
        }

        if (inspecao.getItens() != null && !inspecao.getItens().isEmpty()) {
            boolean aprovado = inspecao.getItens().stream().allMatch(ItemInspecao::isResposta);
            inspecao.setAprovado(aprovado);
        }

        Inspecao salva = repository.save(inspecao);

        if (inspecao.getItens() != null) {
            for (ItemInspecao item : inspecao.getItens()) {
                PerguntaInspecao pergunta = perguntaRepository.findById(item.getPergunta().getId())
                        .orElseThrow(() -> new RuntimeException("Pergunta não encontrada"));
                item.setPergunta(pergunta);
                item.setInspecao(salva);
                itemRepository.save(item);
            }
        }

        return salva;
    }

    @Transactional
    public Inspecao salvarDTO(InspecaoDTO dto, String emailResponsavel) {
        Inspecao inspecao = new Inspecao();

        // Resolve equipamento
        Equipamento eq = equipamentoRepository.findById(dto.getEquipamentoId())
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
        inspecao.setEquipamento(eq);

        // Resolve responsável
        if (dto.getResponsavelId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getResponsavelId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            inspecao.setResponsavel(usuario);
        } else {
            Usuario usuario = usuarioRepository.findByEmail(emailResponsavel)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            inspecao.setResponsavel(usuario);
        }

        inspecao.setDataInspecao(dto.getDataInspecao());
        inspecao.setObservacoes(dto.getObservacoes());

        // Calcula aprovado
        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            boolean aprovado = dto.getItens().stream().allMatch(InspecaoDTO.ItemDTO::isResposta);
            inspecao.setAprovado(aprovado);
        }

        // Salva inspeção
        Inspecao salva = repository.save(inspecao);

        // Salva itens
        if (dto.getItens() != null) {
            for (InspecaoDTO.ItemDTO itemDTO : dto.getItens()) {
                PerguntaInspecao pergunta = perguntaRepository.findById(itemDTO.getPerguntaId())
                        .orElseThrow(() -> new RuntimeException("Pergunta não encontrada"));
                ItemInspecao item = new ItemInspecao();
                item.setPergunta(pergunta);
                item.setResposta(itemDTO.isResposta());
                item.setInspecao(salva);
                itemRepository.save(item);
            }
        }

        return salva;
    }

    @Transactional
    public void deletar(Long id) {
        Inspecao inspecao = buscarPorId(id);
        itemRepository.deleteByInspecao(inspecao);
        repository.deleteById(id);
    }
}