package com.transitops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "permission_groups")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PermissionGroup extends BaseEntity {
    private String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "permission_group_mappings",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private List<Permission> permissions;
}
