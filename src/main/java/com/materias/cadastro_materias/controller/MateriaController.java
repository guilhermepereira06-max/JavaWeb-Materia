package com.materias.cadastro_materias.controller;


import com.materias.cadastro_materias.business.MateriaService;
import com.materias.cadastro_materias.infrastructure.entitys.Materia;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/materia")
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaService materiaService;

    @PostMapping
    public ResponseEntity<Void>salvarMateria(@RequestBody Materia materia){
        materiaService.salvarMateria(materia);
        return ResponseEntity.ok().build();
    }
    @GetMapping
    public ResponseEntity<Materia> buscarMateriaPorProfessor(@RequestParam String professor){
        return ResponseEntity.ok(materiaService.buscarMateriaPorProfessor(professor));
    }
    @DeleteMapping
    public ResponseEntity<Void> deletarMateriaPorProfessor(@RequestParam String professor){
        materiaService.deletarMateriaPorProfessor(professor);
        return ResponseEntity.ok().build();
    }
    @PutMapping
    public ResponseEntity<Void>atualizarMateriaPorId(@RequestParam Integer id,
                                                     @RequestBody Materia materia){
        materiaService.atualizarMateriaPorId(id,materia);
        return ResponseEntity.ok().build();
    }
}
