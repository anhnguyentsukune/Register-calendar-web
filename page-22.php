<?php
/**
 * Template for displaying pages
 *
 * @package flex-theme
 */
get_header();
?>
<style>
    #headerimg, #footer {
        display: none;
    }
    #header ~ hr {
        display: none;
    }
</style>
<main id="primary" class="site-main">
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <header class="entry-header">
            <?php get_template_part( 'template-parts/content/entry-header' ); ?>
        </header>
        <div class="entry-content">
            <?php
            the_content();
            wp_link_pages();
            ?>

            <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/work-calendar/CSS/Style.css">
            <script src="<?php echo get_template_directory_uri(); ?>/work-calendar/JS/lichcanhan.js"></script>

            <?php include( get_template_directory() . '/work-calendar/user.html' ); ?>

        </div>
        <?php if ( get_edit_post_link() ) : ?>
            <footer class="entry-footer">
                <?php edit_post_link(); ?>
            </footer>
        <?php endif; ?>
    </article>
</main>
<?php get_footer(); ?>