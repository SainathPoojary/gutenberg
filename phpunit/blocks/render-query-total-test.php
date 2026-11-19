<?php
/**
 * Tests for the Query Total block rendering.
 *
 * @package WordPress
 * @subpackage Blocks
 *
 * @group blocks
 */
class Tests_Blocks_RenderQueryTotalBlock extends WP_UnitTestCase {

	/**
	 * Original value of $_GET.
	 *
	 * @var array
	 */
	private $original_get;

	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ) {
		// Five posts at two per page make three pages.
		$factory->post->create_many( 5 );
	}

	public function set_up() {
		parent::set_up();
		$this->original_get = $_GET;
	}

	public function tear_down() {
		$_GET = $this->original_get;
		parent::tear_down();
	}

	/**
	 * Renders a Query Loop with a Query Total block and returns the Query Total text.
	 *
	 * @param string      $display_type The `displayType` attribute of Query Total.
	 * @param string|null $page         Value of the `query-1-page` query argument, or null to omit it.
	 * @param array       $query        Overrides for the Query Loop `query` attribute.
	 * @return string The text printed by Query Total.
	 */
	private function render_query_total( $display_type, $page = null, $query = array() ) {
		$_GET = null === $page ? array() : array( 'query-1-page' => $page );

		$markup = sprintf(
			'<!-- wp:query {"queryId":1,"query":%1$s} --><div class="wp-block-query"><!-- wp:query-total {"displayType":"%2$s"} /--></div><!-- /wp:query -->',
			wp_json_encode(
				array_merge(
					array(
						'perPage' => 2,
						'inherit' => false,
					),
					$query
				)
			),
			$display_type
		);

		return trim( wp_strip_all_tags( do_blocks( $markup ) ) );
	}

	public function test_range_display_shows_the_real_total_on_a_page_past_the_last_one() {
		$this->assertSame( 'Displaying 0 of 5', $this->render_query_total( 'range-display', '4' ) );
	}

	public function test_total_results_shows_the_real_total_on_a_page_past_the_last_one() {
		$this->assertSame( '5 results found', $this->render_query_total( 'total-results', '4' ) );
	}

	/**
	 * @dataProvider data_invalid_page_numbers
	 *
	 * @param string $page A page number below 1.
	 */
	public function test_range_display_treats_an_invalid_page_number_as_the_first_page( $page ) {
		$this->assertSame( 'Displaying 1 ' . json_decode( '"–"' ) . ' 2 of 5', $this->render_query_total( 'range-display', $page ) );
	}

	public function data_invalid_page_numbers() {
		return array(
			'zero'     => array( '0' ),
			'negative' => array( '-2' ),
		);
	}

	public function test_range_display_shows_zero_of_zero_when_the_query_has_no_posts() {
		$this->assertSame( 'Displaying 0 of 0', $this->render_query_total( 'range-display', null, array( 'search' => 'no-post-has-this-word' ) ) );
	}
}
