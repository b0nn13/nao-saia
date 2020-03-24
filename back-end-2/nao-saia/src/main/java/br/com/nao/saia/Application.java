package br.com.nao.saia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

/**
 * Classe responsÃ¡vel por realizar o boot da aplicaÃ§Ã£o
 *
 * @author Taynan Rezende Silva
 * @since 22/03/2020
 */
@SpringBootApplication
@EnableReactiveMongoRepositories
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
