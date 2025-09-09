// =============================================================
// src/main/java/com/walton/sales/config/GenFmcgDbConfig.java
// =============================================================
package com.walton.sales.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    entityManagerFactoryRef = "genFmcgEntityManagerFactory",
    transactionManagerRef = "genFmcgTransactionManager",
    basePackages = { "com.walton.sales.repository.genfmcg" }
)
public class GenFmcgDbConfig {

    // Step 1: Define the properties for the genfmcg data source.
    @Bean
    @ConfigurationProperties("genfmcg.datasource")
    public DataSourceProperties genFmcgDataSourceProperties() {
        return new DataSourceProperties();
    }

    // Step 2: Create the actual DataSource bean using the properties.
    @Bean
    public DataSource genFmcgDataSource(@Qualifier("genFmcgDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
    
    // Step 3: Create the EntityManagerFactory using the DataSource.
    @Bean(name = "genFmcgEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
        EntityManagerFactoryBuilder builder,
        @Qualifier("genFmcgDataSource") DataSource dataSource
    ) {
        return builder
            .dataSource(dataSource)
            .packages("com.walton.sales.model.genfmcg") 
            .persistenceUnit("GenFmcg")
            .build();
    }

    // Step 4: Create the TransactionManager.
    @Bean(name = "genFmcgTransactionManager")
    public PlatformTransactionManager transactionManager(
        @Qualifier("genFmcgEntityManagerFactory") EntityManagerFactory entityManagerFactory
    ) {
        return new JpaTransactionManager(entityManagerFactory);
    }
    
    // Step 5: Create the JdbcTemplate for native queries.
    @Bean(name = "genFmcgJdbcTemplate")
    public JdbcTemplate genFmcgJdbcTemplate(@Qualifier("genFmcgDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}