package com.materias.cadastro_materias.infrastructure.repository;

import com.materias.cadastro_materias.infrastructure.entitys.Materia;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MateriaRepository extends JpaRepository<Materia,Integer> {

    Optional<Materia> findByProfessor(String professor);
    @Transactional
    void deleteByProfessor(String professor);
}
