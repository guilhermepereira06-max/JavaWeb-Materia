package com.materias.cadastro_materias.business;


import com.materias.cadastro_materias.infrastructure.entitys.Materia;
import com.materias.cadastro_materias.infrastructure.repository.MateriaRepository;
import org.springframework.stereotype.Service;

@Service
public class MateriaService {

    private final MateriaRepository repository;

    public MateriaService(MateriaRepository repository){
        this.repository = repository;
    }

    public void salvarMateria(Materia materia){
        repository.saveAndFlush(materia);
    }

    public Materia buscarMateriaPorProfessor(String professor){

        return repository.findByProfessor(professor).orElseThrow(
                () -> new RuntimeException("Professor não encontrado")
        );
    }
    public void deletarMateriaPorProfessor(String professor){
        repository.deleteByProfessor(professor);
    }

    public void atualizarMateriaPorId(Integer id,Materia materia){
        Materia materiaEntity= repository.findById(id).orElseThrow(()->
                new RuntimeException("Materia não encontrada"));
        Materia materiaAtualizado = Materia.builder()
                .professor(materia.getProfessor() != null ? materia.getProfessor() :
                        materiaEntity.getProfessor())
                .nome(materia.getNome() != null ? materia.getNome() :
                        materiaEntity.getNome())
                .nota_media(materia.getNota_media() != null ? materia.getNota_media() :
                        materiaEntity.getNota_media())
                .id(materiaEntity.getId())
                .build();

        repository.saveAndFlush(materiaAtualizado);
    }
}
