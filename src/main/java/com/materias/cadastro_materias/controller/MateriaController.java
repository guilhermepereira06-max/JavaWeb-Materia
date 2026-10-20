package com.materias.cadastro_materias.controller;


import com.materias.cadastro_materias.business.MateriaService;
import com.materias.cadastro_materias.infrastructure.entitys.Materia;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/materia")
@RequiredArgsConstructor//construtor
public class MateriaController {//Crud

    private final MateriaService materiaService;//Injeção de dependencia-Atributo da classe-Atributo Objeto

    @PostMapping
    public ResponseEntity<Void>salvarMateria(@RequestBody Materia materia){
        materiaService.salvarMateria(materia);
        return ResponseEntity.ok().build();//aceita qualquer tipo de retorno
    }
    @GetMapping
    public ResponseEntity<List<Materia>> buscarTodasAsMaterias() {
        return ResponseEntity.ok(materiaService.buscarTodas()); // Lembre-se de criar este método no Service
    }

    // 2. Buscar matéria específica por professor (GET /materia/busca?professor=Matheus)
    @GetMapping("/busca")
    public ResponseEntity<Materia> buscarMateriaPorProfessor(@RequestParam String professor){
        return ResponseEntity.ok(materiaService.buscarMateriaPorProfessor(professor));
    }
    @DeleteMapping
    public ResponseEntity<Void> deletarMateriaPorProfessor(@RequestParam String professor){
        materiaService.deletarMateriaPorProfessor(professor);
        return ResponseEntity.ok().build();
    }
    @PutMapping//Atualiza TUDO(Todos os campos)
    public ResponseEntity<Void>atualizarMateriaPorId(@RequestParam Integer id,
                                                     @RequestBody Materia materia){
        materiaService.atualizarMateriaPorId(id,materia);
        return ResponseEntity.ok().build();
    }
}
