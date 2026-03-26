import { Page, Locator, expect } from "@playwright/test";
import path from "path";

// ✅ Define file path for the image to be uploaded
const filePath = path.resolve(__dirname, "../../TestImage.jpg");

/**
 * Page Object Model for Buzz Page interactions.
 */
export default class buzzPage {
  readonly page: Page;

  // Locators used in Buzz Page
  private buzzLink: Locator;
  private cmnt: Locator;
  private sharephoto: Locator;
  private buzzImage: Locator;
  private submitButton: Locator;
  private successMessage: Locator;
  private photoComment: Locator;
  private firstPostFooter: Locator;
  private likeCount: Locator;
  private likeButton: Locator;
  private commentInput: Locator;
  private firstCommentButton: Locator;
  private latestComment: Locator;
  private editToggle: Locator;
  private editButton: Locator;
  private postEdit: Locator;
  private postButton: Locator;
  private verifyCmnt: Locator;
  constructor(page: Page) {
    this.page = page;
    this.buzzLink = page.locator("span.oxd-main-menu-item--name", {
      hasText: "Buzz",
    });
    this.sharephoto = page.locator(
      "//button[normalize-space()='Share Photos']"
    );
    this.buzzImage = page.locator('[type="file"]');
    shareButton: () =>
      this.page.locator(
        "button.oxd-button.oxd-button--medium.oxd-button--main",
        { hasText: "Share" }
      );
    this.submitButton = page.locator("//button[@type='submit']");
    this.successMessage = page.locator(
      "//p[@class='oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text']"
    );
    this.photoComment = page.locator(
      '//textarea[@placeholder="What\'s on your mind?"]'
    );

    this.firstPostFooter = page
      .locator("div.orangehrm-buzz-post-footer")
      .first();
    this.likeCount = this.firstPostFooter.locator('p:has-text("like")');
    this.likeButton = this.page.locator('//div[@class="orangehrm-buzz-post-actions"]/div[not(@class="orangehrm-like-animation")]');
    this.commentInput = this.page.locator(
      '[placeholder="Write your comment..."]'
    );
    this.firstCommentButton = this.page
      .locator("//div[@class='orangehrm-buzz-post-actions']/button[1]")
      .first();
    this.latestComment = this.page.locator(
      "//div[@class='orangehrm-post-comment-area'] / span[@class='oxd-text oxd-text--span orangehrm-post-comment-text']"
    );

    this.editToggle = page.locator("(//button[@type='button'])[9]");
    this.editButton = page.locator(
      "//li[@class='orangehrm-buzz-post-header-config-item'][2]"
    );
    this.postEdit = this.page.locator(
      "(//textarea[@class='oxd-buzz-post-input'])[2]"
    );
    this.postButton = this.page.locator(
      "//div[@class = 'oxd-form-actions orangehrm-buzz-post-modal-actions']/button"
    );
    this.verifyCmnt = this.page.locator(
      "//div[@class='orangehrm-buzz-post-body']/p"
    );
    this.cmnt = this.page.locator(
      "//textarea[@placeholder='What's on your mind?']"
    );
  }

  /**
   * Uploads a photo post and returns the success message text.
   */
  async SharePhotoPost(editcmnt: string){
    await this.buzzLink.click();
    await this.page.waitForTimeout(3000);
    await this.sharephoto.click();
    await this.page.waitForTimeout(2000);
    await this.photoComment.nth(1).fill(editcmnt);
    await this.page.waitForTimeout(1000);
    await this.buzzImage.setInputFiles(filePath);
    await this.page.waitForTimeout(2000);
    await this.submitButton.nth(1).click();
    await this.page.waitForTimeout(5000);
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Clicks the Buzz tab to navigate the user to the respective page.
   */
  async navigateToBuzzModule() {
    await this.buzzLink.click();
  }

  /**
   * Likes the first post and returns the like count before and after the click.
   */
  async likePost() {
    await this.likeButton.nth(0).click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Adds a timestamped comment to the first post and returns the posted comment.
   */
  async addCommentToPost(commentText : string) {
    await this.buzzLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    await this.firstCommentButton.first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.firstCommentButton.first().click();
    await this.page.waitForTimeout(1500);
    await this.commentInput.fill(commentText);
    await this.commentInput.press("Enter");
    await this.page.waitForTimeout(6000);
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Edits the most recent post using predefined edit text and returns the updated post text.
   */
  async editPost(editPostText:string) {
    await this.buzzLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    // Find and click the menu button
    const menuBtn = this.page.locator(".orangehrm-post-menu-button, button[class*='menu']").first();
    await menuBtn.click({ force: true });
    await this.page.waitForTimeout(800);
    
    // Click edit option
    const editBtn = this.page.locator("//button[contains(text(), 'Edit')]").first();
    await editBtn.click({ force: true });
    await this.page.waitForTimeout(1500);
    
    // Find and clear the post edit textarea
    const editTextarea = this.page.locator("textarea").first();
    await editTextarea.clear();
    await editTextarea.fill(editPostText);
    await this.page.waitForTimeout(1000);
    
    // Submit the edit
    const saveBtn = this.page.locator("button[type='submit']").last();
    await saveBtn.click({ force: true });
    await this.page.waitForTimeout(4000);
    
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }
}

// ------------ Helper Functions ------------

/**
 * Appends a timestamp to a comment to ensure uniqueness.
 * @param comment - Base comment text
 * @returns string - Timestamped comment
 */


//-----------------helper methods----------------
// ✅ Static comment and edit post text for testing
const commentText = "this is test comment";
const editPostText = "this is edit post comment";
