// =============================================================
// src/main/java/com/walton/sales/config/UserDbConfig.java
// =============================================================
package com.walton.sales.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    entityManagerFactoryRef = "userEntityManagerFactory",
    transactionManagerRef = "userTransactionManager",
    basePackages = { "com.walton.sales.repository.user" }
)
public class UserDbConfig {

    // Step 1: Define the properties for the user data source.
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties userDataSourceProperties() {
        return new DataSourceProperties();
    }

    // Step 2: Create the actual DataSource bean using the properties.
    @Bean
    @Primary
    public DataSource userDataSource(@Qualifier("userDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    // Step 3: Create the EntityManagerFactory using the DataSource.
    @Primary
    @Bean(name = "userEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
        EntityManagerFactoryBuilder builder,
        @Qualifier("userDataSource") DataSource dataSource
    ) {
        return builder
            .dataSource(dataSource)
            .packages("com.walton.sales.model.user")
            .persistenceUnit("User")
            .build();
    }

    // Step 4: Create the TransactionManager.
    @Primary
    @Bean(name = "userTransactionManager")
    public PlatformTransactionManager transactionManager(
        @Qualifier("userEntityManagerFactory") EntityManagerFactory entityManagerFactory
    ) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}