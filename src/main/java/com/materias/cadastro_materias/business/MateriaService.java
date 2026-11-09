package com.materias.cadastro_materias.business;

import com.materias.cadastro_materias.infrastructure.entitys.Materia;
import com.materias.cadastro_materias.infrastructure.repository.MateriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MateriaService {

    private final MateriaRepository repository;

    public MateriaService(MateriaRepository repository){
        this.repository = repository;
    }

    public void salvarMateria(Materia materia){
        repository.saveAndFlush(materia);
    }

    public List<Materia> buscarTodas() {
        return repository.findAll();
    }

    public Materia buscarMateriaPorProfessor(String professor){
        return repository.findByProfessor(professor).orElseThrow(
                () -> new RuntimeException("Professor não encontrado")
        );
    }

    public void deletarMateriaPorProfessor(String professor){
        repository.deleteByProfessor(professor);
    }

    public void atualizarMateriaPorId(Integer id, Materia materia){
        Materia materiaEntity = repository.findById(id).orElseThrow(() ->
                new RuntimeException("Materia não encontrada"));

        Materia materiaAtualizado = Materia.builder()
                .id(materiaEntity.getId())
                .nome(materia.getNome() != null ? materia.getNome() : materiaEntity.getNome())
                .professor(materia.getProfessor() != null ? materia.getProfessor() : materiaEntity.getProfessor())
                .notaMedia(materia.getNotaMedia() != null ? materia.getNotaMedia() : materiaEntity.getNotaMedia())
                .aulaSemana(materia.getAulaSemana() != null ? materia.getAulaSemana() : materiaEntity.getAulaSemana())
                .build();

        repository.saveAndFlush(materiaAtualizado);
    }
}