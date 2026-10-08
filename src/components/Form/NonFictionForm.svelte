<script lang="ts">
  import { questions } from "./config";
  import Question from "./Question.svelte";

  const { web3formsKey } = $props();

  let formError: "captcha" | "submission" | null = $state(null);
  let submitted = $state(false);

  function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const hcaptcha = formData.get("h-captcha-response");

    if (!hcaptcha) {
      formError = "captcha";
      return;
    }

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          formError = null;
        } else {
          formError = "submission";
          throw Error("Form submission failed");
        }
      })
      .catch((e) => {
        formError = "submission";
        throw e;
      })
      .finally(() => {
        submitted = true;
        form.reset();
      });
  }

  let answers = $state(
    Object.fromEntries(questions.map((value) => [value.id, ""])),
  );

  const smoothScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };
</script>

<form onsubmit={handleSubmit} class="scroll-smooth">
  <input type="hidden" name="access_key" value={web3formsKey} />
  <input
    hidden
    name="Fiction/NonFiction"
    id="fiction-non-fiction"
    type="text"
    value="Fiction"
  />
  <div class="m-auto max-w-3xl">
    {#each questions as question, index}
      <div
        class="h-dvh flex items-center justify-center flex-col"
        id="{question.id}-container"
      >
        <Question {question} {index} bind:value={answers[question.id]} />
        {#if questions.length == index + 1}
          <button
            type="button"
            class="btn"
            onclick={() => smoothScroll("#review")}
          >
            Review Questions
          </button>
        {:else}
          <button
            type="button"
            class="btn"
            onclick={() =>
              smoothScroll(`#${questions[index + 1].id}-container`)}
          >
            Next Question
          </button>
        {/if}
      </div>
    {/each}
    <div>
      <h3 id="review">Review</h3>
      <ol class="list-decimal list-inside marker:text-xl">
        {#each questions as question}
          <li>
            <button
              class="text-xl text-left cursor-pointer"
              type="button"
              onclick={() => {
                smoothScroll(`#${question.id}-container`);
              }}
            >
              {question.label}
            </button>
            <p class="text-xl">
              {answers[question.id] ? answers[question.id] : "No Answer"}
            </p>
          </li>
        {/each}
      </ol>
    </div>
    <div class="h-captcha" data-captcha="true"></div>
    <button type="submit" class="btn text-lg">Submit</button>
  </div>
</form>
