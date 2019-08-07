package com.eclipsesource.workflow.analyzer.coffee;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.junit.jupiter.api.Test;

class AnalyzeWorkflowTest {

	@Test
	void test() throws IOException, URISyntaxException {
		// probability config:
		// - low:    0.1
		// - medium: 0.5
		// - high:   0.75
		String config = loadResource("SuperBrewer3000.wfconfig");
		
		// model with workflow: PreHeat -> Decision --[medium]--> Brew
		//                                    +-------[ high ]--> Alternative Brew
		String model = loadResource("SuperBrewer3000.coffee");

		String analyzeResult = new AnalyzeWorkflow(model, config).generate();
		
		// expected result:
		// sum: 0.5 (medium) + 0.75 (high) = 1.25
		// - Brew: 0.75 / 1.25 = 0.6
		// - AlternativeBrew: 0.5 / 1.25 = 0.4
		String expectedResult = loadResource("SuperBrewer3000.result");
		
		// ignore whitespaces in comparsion
		assertEquals(expectedResult.replaceAll("\\s+",""), analyzeResult.replaceAll("\\s+",""));
	}
	
	private static String loadResource(String name) throws IOException, URISyntaxException {
		URL url = AnalyzeWorkflowTest.class.getResource(name);
		String config = new String(Files.readAllBytes(Paths.get(url.toURI())));
		return config;
	}
}