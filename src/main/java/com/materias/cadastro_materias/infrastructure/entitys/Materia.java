package com.materias.cadastro_materias.infrastructure.entitys;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "materia")
@Entity
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    //Professor só pode ter 1 e que leciona uma materia, e uma materia só pode existir e feita por 1 professor, ambos não pode ter nomes iguais com outros, ex:Dois professores robson ou duas matematicas
    @Column(name = "nome",unique = true)
    private String nome;

    @Column(name = "professor",unique = true)
    private String professor;

    @Column(name = "nota_media")
    private String nota_media;

    @Column(name = "aula_semana")
    private String aula_semana;
}
