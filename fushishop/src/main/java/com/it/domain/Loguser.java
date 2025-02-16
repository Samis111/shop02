package com.it.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 
 * @TableName loguser
 */
@TableName(value ="loguser")
@Data
public class Loguser implements Serializable {
    /**
     * 
     */
    @TableId
    private Integer id;

    /**
     * 
     */
    private Integer uid;

    /**
     * 
     */
    private String uusername;

    /**
     * 
     */
    private String node;

    /**
     * 
     */
    private Date infotime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        Loguser other = (Loguser) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getUid() == null ? other.getUid() == null : this.getUid().equals(other.getUid()))
            && (this.getUusername() == null ? other.getUusername() == null : this.getUusername().equals(other.getUusername()))
            && (this.getNode() == null ? other.getNode() == null : this.getNode().equals(other.getNode()))
            && (this.getInfotime() == null ? other.getInfotime() == null : this.getInfotime().equals(other.getInfotime()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getUid() == null) ? 0 : getUid().hashCode());
        result = prime * result + ((getUusername() == null) ? 0 : getUusername().hashCode());
        result = prime * result + ((getNode() == null) ? 0 : getNode().hashCode());
        result = prime * result + ((getInfotime() == null) ? 0 : getInfotime().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", uid=").append(uid);
        sb.append(", uusername=").append(uusername);
        sb.append(", node=").append(node);
        sb.append(", infotime=").append(infotime);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}