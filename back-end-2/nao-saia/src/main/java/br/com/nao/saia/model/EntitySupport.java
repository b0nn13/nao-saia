package br.com.nao.saia.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;

import java.time.LocalDateTime;
import java.util.UUID;

public class EntitySupport implements Persistable<UUID> {

    @Id
    private UUID id;

    private LocalDateTime createdAt;

    private LocalDateTime updateAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }

    @Override
    public boolean isNew() {
        return getId() == null;
    }

}
