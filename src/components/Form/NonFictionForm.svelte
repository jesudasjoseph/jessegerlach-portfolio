<script lang="ts">
  import { onMount } from 'svelte'
  import { questions } from './config'
  import Question from './Question.svelte'

  const { web3formsKey } = $props()

  let formError: 'captcha' | 'submission' | null = $state(null)
  let submitted = $state(false)

  function handleSubmit(event: Event) {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const hcaptcha = formData.get('h-captcha-response')

    if (!hcaptcha) {
      formError = 'captcha'
      return
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          formError = null
        } else {
          formError = 'submission'
          throw Error('Form submission failed')
        }
      })
      .catch((e) => {
        formError = 'submission'
        throw e
      })
      .finally(() => {
        submitted = true
        form.reset()
      })
  }

  let answers = $state(
    Object.fromEntries(questions.map((value) => [value.id, '']))
  )

  const smoothScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  let contractDialog: HTMLDialogElement
  let contractRead: null | boolean = $state(null)
  let reviewScrolled = $state(false)
  let formFilled = $derived(Object.values(answers).every((v) => v))

  onMount(() => {
    const observer = new IntersectionObserver(
      () => {
        reviewScrolled = true
      },
      {
        root: document.querySelector('body'),
        rootMargin: '0px',
        scrollMargin: '0px',
        threshold: 1.0,
      }
    )

    const review = document.querySelector('#review')

    if (review) observer.observe(review)
    return () => {
      if (review) observer.unobserve(review)
    }
  })
</script>

<form onsubmit={handleSubmit} class="scroll-smooth m-auto md:max-w-3xl px-8">
  <input type="hidden" name="access_key" value={web3formsKey} />
  <input
    hidden
    name="Fiction/NonFiction"
    id="fiction-non-fiction"
    type="text"
    value="Fiction"
  />
  <div>
    {#each questions as question, index}
      <div
        class="min-h-dvh flex items-center justify-start flex-col relative pt-8 pb-30 mb-[25dvh]"
        id="{question.id}-container"
      >
        <Question {question} {index} bind:value={answers[question.id]} />
        {#if questions.length == index + 1}
          <button
            type="button"
            class="btn absolute bottom-8 m-0"
            onclick={() => smoothScroll('#review')}
          >
            Review Answers
          </button>
        {:else if reviewScrolled}
          <button
            type="button"
            class="btn absolute bottom-8 m-0"
            onclick={() => smoothScroll(`#review`)}
          >
            Back to Review
          </button>
        {:else}
          <button
            type="button"
            class="btn absolute bottom-8 m-0"
            onclick={() =>
              smoothScroll(`#${questions[index + 1].id}-container`)}
          >
            Next Question
          </button>
        {/if}
      </div>
    {/each}
    <div id="review" class="py-8">
      <h2 class="text-3xl mb-8">Review</h2>
      <ol class="list-outside marker:text-3xl">
        {#each questions as question, index}
          <li class="mb-16">
            <button
              class="text-xl text-left cursor-pointer mb-4 hover:underline"
              type="button"
              onclick={() => {
                smoothScroll(`#${question.id}-container`)
              }}
            >
              <span class="text-3xl font-bold">{index + 1}.</span>
              {question.label}
            </button>
            <p
              class="text-xl border-b border-gray-600 p-2 {answers[question.id]
                ? ''
                : 'text-red-400'}"
            >
              {answers[question.id] ? answers[question.id] : 'No Answer'}
            </p>
          </li>
        {/each}
      </ol>
    </div>

    <div class="h-captcha" data-captcha="true"></div>
    <button
      type="button"
      class="btn text-lg"
      disabled={!formFilled}
      onclick={() => {
        contractDialog.showModal()
      }}
    >
      Submit
    </button>
  </div>
  <dialog
    class="top-1/2 left-1/2 -translate-1/2 rounded-3xl bg-gray-700 text-white backdrop:bg-gray-900/80"
    bind:this={contractDialog}
  >
    <div class="m-4 mb-2 flex justify-between items-baseline">
      <h1 class="text-2xl">
        Writing Coaching & Developmental Editing Services Agreement: Terms
        Preview
      </h1>
      <button
        class="cursor-pointer p-3 group relative"
        type="button"
        onclick={() => {
          contractDialog.close()
        }}
      >
        <div>
          <div
            class="border w-4 -rotate-45 group-hover:scale-110 absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 duration-150 transition-all"
          ></div>
          <div
            class="border w-4 rotate-45 group-hover:scale-110 absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 duration-150 transition-all"
          ></div>
        </div>
        <span class="sr-only">Cancel</span>
      </button>
    </div>
    <div class="max-h-[75dvh] overflow-scroll px-4 mb-4 contract">
      <h2>About This Preview</h2>
      <p>
        This page sets out every term of the Writing Coaching &amp;
        Developmental Editing Services Agreement (the "Agreement") that you will
        be asked to sign before any work begins. It is a preview, not a
        contract.
      </p>
      <p>
        Confirming that you have read this preview indicates your intent to sign
        the Agreement on these terms. You will not be bound by any term, and no
        payment will be owed, until both you and Jesse Gerlach sign the
        Agreement itself. If anything here differs from the signed Agreement,
        the signed Agreement controls.
      </p>
      <p>
        Throughout this preview, "you" means the client, and "Coach" means Jesse
        Gerlach.
      </p>

      <h2>1. Parties and Definitions</h2>
      <p>
        The Agreement will be between <strong>Jesse Gerlach</strong>, a sole
        proprietor doing business in Corvallis, Oregon, and you. At signing, you
        will provide your full legal name, email address for notices, phone
        number, mailing address, the working title of your book (the "Project"),
        and its genre.
      </p>
      <p>The Agreement will use these defined terms:</p>
      <ul>
        <li>
          <strong>Project:</strong> your book, including every draft, revision, edition,
          and version of it.
        </li>
        <li>
          <strong>Work Product:</strong> all written material Coach creates specifically
          for your Project, including manuscript text, chapter edits, and the story-specific
          content of any outline (your plot, characters, settings, and scenes). Work
          Product will not include Proprietary Materials.
        </li>
        <li>
          <strong>Proprietary Materials:</strong> Coach's outline templates,
          including their structure, format, section architecture, beat and
          chapter frameworks, prompts, and organizational methods, whether
          provided blank, partially completed, or completed with your content.
          This also covers Coach's worksheets, checklists, market research
          reports, genre and market analyses, and process documents, whether
          created before or during the Agreement. The template portion is
          referred to as the <strong>Outline Templates</strong>.
        </li>
        <li>
          <strong>Derivative Works:</strong> any adaptation, translation, or other
          work based on the Project in any medium now known or later developed, including
          film, television, streaming, stage, audio, graphic novel, video game, and
          merchandise.
        </li>
      </ul>

      <h2>2. Services and Package Selection</h2>
      <p>
        When you sign, you will select one of the three packages below. Changing
        or adding a package later will require a written amendment signed, or
        confirmed by email, by both you and Coach.
      </p>

      <h2>Package A: Hourly Consultation</h2>
      <p>
        Coach will provide consultation services as you request them, which may
        include brainstorming, manuscript troubleshooting, developmental
        feedback, or guidance on specific issues with your Project. Sessions may
        be held in person or online, at your option and subject to Coach's
        availability.
      </p>
      <ul>
        <li>
          <strong>Rates:</strong> sessions are booked in 30-minute or 60-minute
          increments, at <strong>$35.00 per 30-minute session</strong> and
          <strong>$65.00 per 60-minute session</strong>. Longer sessions are
          billed in the same increments.
        </li>
        <li>
          <strong>Payment:</strong> due in full at the time of booking, before the
          session begins.
        </li>
        <li>
          <strong>Credit:</strong> Coach will be credited as
          <strong>Writing Consultant</strong> (see Section 8).
        </li>
      </ul>

      <h2>Package B: Milestone Package</h2>
      <p>
        Coach will collaborate with you through each milestone you select. Each
        milestone is a separate, independently priced stage of work, paid for in
        advance. You may pause the Project between milestones (see Section 5).
      </p>
      <table>
        <thead>
          <tr><th>Milestone</th><th>What It Covers</th><th>Fee</th></tr>
        </thead>
        <tbody>
          <tr
            ><td>1. Market Research</td><td
              >Analysis of genre, comparable titles, audience, and market
              positioning for your Project</td
            ><td>$100.00</td></tr
          >
          <tr
            ><td>2. Outline</td><td
              >A complete Project outline, including chapters, sections, and
              related research, built on Coach's Outline Templates</td
            ><td>$600.00</td></tr
          >
          <tr
            ><td>3. Chapter Writing Coaching &amp; Editing</td><td
              >Chapter-by-chapter coaching and developmental editing</td
            ><td
              >Negotiated by book length and agreed in writing before this
              milestone begins</td
            ></tr
          >
          <tr
            ><td>4. Publish-Ready Formatting &amp; Proofreading</td><td
              >Final proofreading and formatting for submission or publication</td
            ><td>$300.00</td></tr
          >
          <tr
            ><td>5. Cover Art &amp; Self-Publishing Assistance (optional)</td
            ><td>Cover art coordination and guidance through self-publishing</td
            ><td>$400.00</td></tr
          >
        </tbody>
      </table>
      <p>
        The Agreement will record the agreed Milestone 3 fee and your estimated
        word count. Coach will be credited as <strong
          >Developmental Editor</strong
        > (see Section 8).
      </p>

      <h2>Package C: Director's Package ($3,500.00)</h2>
      <p>
        You will serve as creative director of the Project and make all final
        creative decisions. Under your direction, Coach will ghostwrite or
        co-write the Project and perform the work of Milestones 1 through 5,
        including outlining, writing, editing, proofreading, and formatting.
        Coach will make reasonable efforts to reflect your intent, voice, and
        style.
      </p>
      <ul>
        <li>
          <strong>Payment:</strong> the full $3,500.00 fee will be due before work
          begins.
        </li>
        <li>
          <strong>Scope:</strong> the fee covers a Project up to an
          <strong>Expected Word Count</strong>, recorded and initialed by both
          parties at signing, plus two complete revisions per stage (see Section
          4).
        </li>
        <li>
          <strong>Credit:</strong> Coach will be credited as
          <strong>Developmental Editor</strong> (see Section 8). Coach will not claim
          authorship, and you may publish the Project solely under your name or pen
          name.
        </li>
      </ul>
      <p>
        <strong>Additional costs (Director's Package only).</strong> The $3,500.00
        fee will not cover work beyond that scope. Additional costs will apply if
        the Project exceeds the Expected Word Count, or if you request more than two
        complete revisions of any stage. In either case:
      </p>
      <ol>
        <li>
          Coach will notify you in writing, describing the additional work and
          estimating the hours needed to complete it.
        </li>
        <li>
          The additional cost will be negotiated in good faith and calculated
          from Coach's estimated time of completion at <strong
            >$65.00 per hour</strong
          >.
        </li>
        <li>
          The agreed cost will be recorded in a Scope Adjustment Record in the
          Agreement, or confirmed by email by both parties, and paid in advance
          before Coach begins the additional work.
        </li>
        <li>
          If you and Coach do not agree on an additional cost, Coach will have
          no obligation to perform the additional work. Coach may complete the
          Project within the original scope, or either party may terminate under
          Section 10.
        </li>
      </ol>

      <h2>3. Payment Terms</h2>
      <ul>
        <li>
          <strong>Payment in advance:</strong> all fees will be payable in advance.
          Coach will have no obligation to begin any session, milestone, package,
          or revision until payment is received in cleared funds.
        </li>
        <li>
          <strong>Fees non-refundable:</strong> each fee will be fully earned when
          the corresponding session, milestone, package, or revision begins, and non-refundable
          after that point, including if the Agreement is terminated for any reason.
        </li>
        <li>
          <strong>Other charges:</strong> cancellation fees and any other amounts
          not paid in advance will be due within seven (7) days of Coach's invoice.
          Coach may suspend all services while any amount is past due.
        </li>
        <li>
          <strong>Payment methods:</strong> Coach will specify accepted payment methods
          on each invoice or booking confirmation.
        </li>
        <li>
          <strong>Expenses:</strong> Coach will pay Coach's own travel expenses for
          in-person sessions. Third-party costs you request (such as paid cover artists,
          ISBNs, copyright registration, or platform fees) will be your responsibility
          unless agreed otherwise in writing.
        </li>
      </ul>

      <h2>4. Revisions</h2>
      <ul>
        <li>
          <strong>Included revisions:</strong> each milestone of Package B, and
          each corresponding stage of Package C, will include
          <strong>two (2) complete revisions</strong> at no additional cost. A "complete
          revision" means one round in which you provide consolidated feedback on
          that milestone's deliverables and Coach revises them in response.
        </li>
        <li>
          <strong>Milestone Package:</strong> each revision beyond the two
          included will cost <strong>$150.00</strong>, paid in advance.
        </li>
        <li>
          <strong>Hourly Consultation:</strong> revision limits will not apply. All
          work will be billed at the session rates.
        </li>
        <li>
          <strong>Director's Package:</strong> the $150.00 revision fee will not apply.
          Revisions beyond the two included per stage will be an additional cost negotiated
          from Coach's estimated time at $65.00 per hour, as described in Package
          C.
        </li>
      </ul>

      <h2>5. Pausing the Project</h2>
      <p>
        Under Package B, you may pause the Project after any completed milestone
        and resume at any time by notifying Coach. Coach will resume work as
        Coach's schedule reasonably permits. If the Project is paused for more
        than twelve (12) consecutive months, Coach may update the fees for
        remaining milestones by written notice before work resumes, and either
        party may terminate under Section 10.
      </p>

      <h2>6. Scheduling and Cancellation</h2>
      <ul>
        <li>
          <strong>Your cancellations:</strong> you may cancel or reschedule any
          session without charge by giving at least
          <strong>twenty-four (24) hours'</strong>
          notice. Cancelling with less notice, or not attending, will incur a
          <strong>$30.00</strong> cancellation fee. This applies equally to in-person
          and online sessions.
        </li>
        <li>
          <strong>Coach's cancellations:</strong> if Coach cancels a session with
          less than twenty-four (24) hours' notice, Coach will reschedule it at no
          additional cost to you.
        </li>
      </ul>

      <h2>7. Ownership of the Project and Work Product</h2>
      <ul>
        <li>
          <strong>You own your Project:</strong> you will retain all ownership of
          your own ideas, concepts, and material contributed to the Project.
        </li>
        <li>
          <strong>Assignment of Work Product:</strong> once Coach receives payment
          in full for the session, milestone, or package in which Work Product was
          created, Coach will assign to you all right, title, and interest, including
          copyright, in that Work Product. This will include the exclusive worldwide
          right to publish, reproduce, distribute, sell, license, perform, and display
          the Project, and to create and exploit Derivative Works in any medium. Until
          payment in full is received, Work Product will remain Coach's property.
        </li>
        <li>
          <strong>Credit is a condition:</strong> these rights will be subject to
          your credit obligations under Section 8, which will survive any assignment,
          sale, or license of the Project.
        </li>
        <li>
          <strong>Coach keeps Proprietary Materials:</strong> nothing in the Agreement
          will transfer ownership of Proprietary Materials to you. You will receive
          a limited, non-exclusive, non-transferable, non-sublicensable license to
          use any Proprietary Materials provided to you solely to develop, write,
          publish, and exploit your Project and its Derivative Works.
        </li>
      </ul>

      <h2>8. Required Credit</h2>
      <p>
        In consideration for Coach's contribution, you will credit Coach as
        follows:
      </p>
      <table>
        <thead>
          <tr><th>Package</th><th>Required Credit</th></tr>
        </thead>
        <tbody>
          <tr
            ><td>Package B (Milestone) or Package C (Director's)</td><td
              ><strong>Developmental Editor: Jesse Gerlach</strong></td
            ></tr
          >
          <tr
            ><td>Package A (Hourly Consultation) only</td><td
              ><strong>Writing Consultant: Jesse Gerlach</strong></td
            ></tr
          >
        </tbody>
      </table>
      <p>
        If you purchase services under both Package A and Package B or C, the
        Developmental Editor credit will apply.
      </p>
      <ul>
        <li>
          <strong>Regardless of amount of work:</strong> the credit obligation will
          apply no matter how many hours, sessions, or milestones Coach performed,
          and will continue after the Agreement ends for any reason, including termination.
        </li>
        <li>
          <strong>Placement:</strong> you will include the credit (a) in every published
          edition of the Project (print, e-book, and audio), on the copyright page,
          acknowledgments page, or a contributor credits page; (b) in the credits
          or contributor listing of any Derivative Work you produce or control; and
          (c) wherever other editorial or consulting contributors are credited.
        </li>
        <li>
          <strong>Third parties:</strong> before signing any publishing, licensing,
          option, or adaptation agreement, you will notify the other party in writing
          of Coach's credit, include a provision requiring that credit, and use best
          efforts to secure its inclusion. If a third party refuses despite your best
          efforts, you will notify Coach in writing before signing.
        </li>
        <li>
          <strong>Failure to credit:</strong> if the credit is omitted, Coach may
          give you written notice. You will correct the omission within thirty (30)
          days for digital editions and listings, and in the next printing for physical
          editions. Failure to correct it will be a material breach of the Agreement.
        </li>
      </ul>

      <h2>9. Protection of Proprietary Materials and Outline Templates</h2>
      <p>
        <strong>Prohibited conduct.</strong> Without Coach's explicit, prior written
        permission, you will not, directly or through anyone else:
      </p>
      <ol>
        <li>
          Copy, reproduce, distribute, redistribute, share, post, upload,
          publish, sell, lease, or give away any Outline Template or other
          Proprietary Materials, in whole or in part, including blank or
          content-removed versions.
        </li>
        <li>
          Modify, repackage, rename, or create derivative templates, courses,
          workbooks, or products from them.
        </li>
        <li>
          Use them to provide coaching, outlining, editing, ghostwriting, or
          consulting services to any other person or entity.
        </li>
        <li>Present them as your own or another person's creation.</li>
        <li>
          Enter them into any AI tool, dataset, or model training system for any
          purpose other than developing your Project.
        </li>
      </ol>
      <p>
        <strong>What will not be restricted.</strong> Nothing in the Agreement will
        prevent you from publishing and exploiting your Project as described in Section
        7, or from using the general writing skills and knowledge you gain through
        the services in your own writing.
      </p>
      <p>
        <strong>Confidentiality.</strong> You will keep the Proprietary Materials
        confidential, disclosing them only to your own agents, publishers, or collaborators
        who need them for the Project and who are bound by equally protective confidentiality
        obligations. Coach will keep your unpublished manuscript, ideas, and Project
        materials confidential and will use them only to perform the services.
      </p>
      <p>
        <strong>Liquidated damages.</strong> Both parties will agree that
        violating the prohibited-conduct terms would cause Coach harm that is
        difficult to measure precisely, including lost business, loss of the
        market value of the Outline Templates, and damage to Coach's livelihood
        and reputation. For
        <strong
          >each violation, you will pay Coach liquidated damages of $100,000.00</strong
        >. Both parties will agree this amount is a reasonable estimate of
        Coach's anticipated harm and not a penalty.
      </p>
      <p>
        <strong>Injunctive relief.</strong> You will acknowledge that a violation
        would cause Coach irreparable harm. In addition to any other remedy, Coach
        will be entitled to seek a temporary restraining order, preliminary and permanent
        injunction, or other equitable relief to stop any actual or threatened violation,
        without proving actual damages, and without posting a bond to the extent permitted
        by law.
      </p>
      <p>
        <strong>Duration.</strong> These protections will survive the termination
        or completion of the Agreement indefinitely.
      </p>

      <h2>10. Termination</h2>
      <ul>
        <li>
          <strong>At will:</strong> either party may terminate the Agreement at any
          time, for any reason or no reason, by written notice to the other (email
          is sufficient).
        </li>
        <li>
          <strong>Payment obligations survive:</strong> regardless of who terminates
          or why, you will pay in full (a) the fee for any session, milestone, package,
          or revision that was begun, booked, or invoiced before the termination notice;
          (b) any cancellation fees owed; and (c) any other amount invoiced before
          termination. Fees already paid will remain non-refundable.
        </li>
        <li>
          <strong>Delivery of work:</strong> within fourteen (14) days after termination,
          Coach will deliver any Work Product completed for services you have paid
          for in full.
        </li>
        <li>
          <strong>Survival:</strong> the terms on payment, ownership, credit, protection
          of Proprietary Materials, termination, client representations, limitation
          of liability, independent contractor status, and governing law will survive
          termination.
        </li>
      </ul>

      <h2>11. No Guarantee of Results</h2>
      <p>
        Coach will perform the services professionally and in good faith.
        Publishing outcomes depend on factors outside Coach's control, so Coach
        will make no guarantee that your Project will be accepted by any agent
        or publisher, or will achieve any level of sales, rankings, reviews, or
        awards.
      </p>

      <h2>12. Your Representations</h2>
      <p>
        You will represent that all material you provide for the Project is your
        original work or material you have the right to use. You will indemnify
        and hold Coach harmless from any claim, loss, or expense (including
        reasonable attorney fees) arising from material you provide or from your
        publication or exploitation of the Project.
      </p>

      <h2>13. Limitation of Liability</h2>
      <p>
        Except for Coach's confidentiality obligations, Coach's total liability
        under the Agreement will not exceed the total fees you actually paid.
        Neither party will be liable for indirect, incidental, or consequential
        damages, including lost profits, except that this limitation will not
        apply to your obligations on payment, credit, or protection of
        Proprietary Materials.
      </p>

      <h2>14. Independent Contractor</h2>
      <p>
        Coach will be an independent contractor, not your employee, partner, or
        agent. Coach will control the manner and schedule of the work, subject
        to the Agreement, and will be responsible for Coach's own taxes.
      </p>

      <h2>15. Governing Law, Disputes, and Attorney Fees</h2>
      <ul>
        <li>
          <strong>Governing law:</strong> the Agreement will be governed by the laws
          of the State of Oregon, without regard to its conflict-of-law rules.
        </li>
        <li>
          <strong>Venue:</strong> any lawsuit will be brought exclusively in the Circuit
          Court of the State of Oregon for Benton County, and both parties will consent
          to that court's jurisdiction. Either party may seek injunctive relief in
          any court of competent jurisdiction.
        </li>
        <li>
          <strong>Attorney fees:</strong> in any action to enforce or interpret the
          Agreement, including collecting unpaid fees or enforcing the credit and
          Proprietary Materials terms, the prevailing party will be entitled to recover
          reasonable attorney fees, costs, and expenses, including on appeal.
        </li>
      </ul>

      <h2>16. General Provisions</h2>
      <ul>
        <li>
          <strong>Entire agreement:</strong> the signed Agreement will be the entire
          agreement regarding the services and will supersede all prior discussions,
          including this preview. Coach's portfolio and promotional use of the Project
          will be governed separately by Coach's published policies.
        </li>
        <li>
          <strong>Amendments:</strong> only in a writing signed by both parties, or
          an email exchange in which both expressly confirm the change.
        </li>
        <li>
          <strong>Severability:</strong> if any provision is held unenforceable, it
          will be enforced to the maximum extent permitted, and the rest will remain
          in full force.
        </li>
        <li>
          <strong>Assignment:</strong> you may not assign the Agreement without Coach's
          written consent, except that you may transfer rights in the Project if the
          new owner agrees in writing to honor the credit and Proprietary Materials
          terms.
        </li>
        <li>
          <strong>Notices:</strong> notices may be sent by email to the addresses
          on the signature page and will be effective when sent.
        </li>
        <li>
          <strong>Electronic signatures:</strong> the Agreement may be signed electronically
          and in counterparts.
        </li>
      </ul>

      <h2>17. Signing</h2>
      <p>
        The Agreement will include initial lines for your package selection, the
        Expected Word Count (Director's Package), the credit obligation, the
        Proprietary Materials protections, termination, and each page. It will
        end with signature, printed name, and date lines for both you and Coach.
        By signing, each party will confirm they have read, understand, and
        agree to every term, including the payment, credit, termination, and
        liquidated damages provisions.
      </p>
      <div class="border-t mx-4 my-8"></div>
      <div class="flex justify-between items-top gap-8 px-4 pb-8">
        <label class="cursor-pointer flex items-center gap-4">
          <input
            type="checkbox"
            required
            name="Read Contract"
            bind:checked={contractRead}
          />
          <p class="m-0">
            I have read the above contract and hereby express my intent to
            proceed with the contract.
          </p>
        </label>
        <button
          class="btn py-3 my-0"
          type="submit"
          disabled={!(formFilled && contractRead)}>Submit</button
        >
      </div>
    </div>
  </dialog>
</form>

<style>
  .contract {
    h2 {
      font-size: var(--text-lg);
    }
    ul {
      margin-left: calc(var(--spacing) * 4);
      margin-bottom: calc(var(--spacing) * 4);
      list-style: disc;
    }
    th {
      text-align: left;
    }
  }
</style>
