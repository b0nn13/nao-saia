package br.com.nao.saia.controller;

import br.com.nao.saia.dto.MerchantDTO;
import br.com.nao.saia.dto.ResponseDTO;
import br.com.nao.saia.model.User;
import br.com.nao.saia.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import javax.validation.Valid;

/**
 * Classe que armazena os endpoints de {@link User} recebendo as requisicoes,
 * tratando e devolvendo os resultados
 *
 * @author Taynan Rezende
 * @since 22/03/2020
 */
@RestController
@RequestMapping("users")
public class UserController {

	private static final String JSON = MediaType.APPLICATION_JSON_VALUE;

	private final UserService service;
	
	public UserController(UserService userService) {
		this.service = userService;
	}
	
	@PostMapping(path = "/login", consumes = JSON, produces = JSON)
	public ResponseDTO login(@Valid @RequestBody User user) {
		return service.login(user);
	}
	
	@PostMapping(path = "/", consumes = JSON, produces = JSON)
	public ResponseDTO createUser(@Valid @RequestBody User user) {
		return service.createUser(user);
	}
	
	@GetMapping("/{id}")
	public User findById(@PathVariable UUID id) {
		return service.findById(id);
	}

}